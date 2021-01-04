const {Schema, model} = require('mongoose');
const slugify = require('slugify');
const geocoder = require('../utils/geocoder');

const BootcampSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Bootcamp name is required'],
            unique: true,
            trim: true,
            maxlength: [50, 'Name can not be more than 50 characters'],
        },
        slug: String,
        description: {
            type: String,
            required: [true, 'Bootcamp description is required'],
            maxlength: [500, 'Description can not be more than 500 characters'],
        },
        website: {
            type: String,
            match: [
                /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
                'Please use a valid URL for website',
            ],
        },
        email: {
            type: String,
            match: [
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                'Please add a valid email',
            ],
        },
        address: {
            type: String,
            required: [true, 'Bootcamp address is required'],
        },
        location: {
            type: {
                type: String,
                enum: ['Point'],
                // required: true,
            },
            coordinates: {
                type: [Number],
                // required: true,
                index: '2dsphere',
            },
            formattedAddress: String,
            street: String,
            city: String,
            state: String,
            zipcode: String,
            country: String,
        },
        careers: {
            type: [String],
            required: true,
            enum: [
                'Web Development',
                'Mobile Development',
                'UI/UX',
                'Data Science',
                'Business',
                'Other',
            ],
        },
        averageRating: {
            type: Number,
            min: [1, 'Rating must be at least 1'],
            max: [10, 'Rating must can not be more than 10'],
        },
        averageCost: Number,
        photo: {
            type: String,
            default: 'no-photo.jpg',
        },
        housing: {
            type: Boolean,
            default: false,
        },
        jobAssistance: {
            type: Boolean,
            default: false,
        },
        jobGuarantee: {
            type: Boolean,
            default: false,
        },
        acceptGi: {
            type: Boolean,
            default: false,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        toJSON: {virtuals: true},
        toObject: {virtuals: true},
    },
);

// Create bootcamp slug by name
BootcampSchema.pre('save', function (next) {
    this.slug = slugify(this.name, {lower: true});
    next();
});

// Geocode & create location fields
BootcampSchema.pre('save', async function (next) {
    const loc = await geocoder.geocode(this.address);

    this.location = {
        type: 'Point',
        coordinates: [loc[0].longitude, loc[0].latitude],
        formattedAddress: loc[0].formattedAddress,
        street: loc[0].streetName,
        city: loc[0].city,
        zipcode: loc[0].zipcode,
        state: loc[0].stateCode,
        country: loc[0].countryCode,
    };

    // Don't save address in DB
    this.address = undefined;

    next();
});

// Delete all bootcamp courses when bootcamp is deleted
BootcampSchema.pre('remove', async function (next) {
    await this.model('Course').deleteMany({bootcamp: this._id});
    next();
});

// Reverse populate with virtuals
BootcampSchema.virtual('courses', {
    ref: 'Course',
    localField: '_id',
    foreignField: 'bootcamp',
    justOne: false,
});

BootcampSchema.index({location: '2dsphere'});

module.exports = model('Bootcamp', BootcampSchema);
