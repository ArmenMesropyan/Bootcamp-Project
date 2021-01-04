const {Schema, model} = require('mongoose');

const CourseSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Course title is required'],
        unique: true,
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Course description is required'],
    },
    weeks: {
        type: String,
        required: [true, 'Course number of weeks is required'],
    },
    tuition: {
        type: Number,
        required: [true, 'Course tuition cost is required'],
    },
    minimumSkill: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        required: [true, 'Course minimumSkill is required'],
    },
    scholarshipAvailable: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    bootcamp: {
        type: Schema.ObjectId,
        ref: 'Bootcamp',
        required: true,
    },
});

// Static method to get average bootcamp courses cost
CourseSchema.statics.getAverageCost = async function (bootcampId) {
    const obj = await this.aggregate([
        {
            $match: {
                bootcamp: bootcampId,
            },
        },
        {
            $group: {
                _id: '$bootcamp',
                averageCost: {$avg: '$tuition'},
            },
        },
    ]);

    try {
        await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
            averageCost: Math.ceil(obj[0].averageCost / 10) * 10,
        });
    } catch (error) {
        console.error(error);
    }
};

// Call getAverageCost after save
CourseSchema.post('save', function () {
    this.constructor.getAverageCost(this.bootcamp);
});

// Call getAverageCost before remove
CourseSchema.pre('remove', function (next) {
    this.constructor.getAverageCost(this.bootcamp);
    next();
});

module.exports = model('Course', CourseSchema);
