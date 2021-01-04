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

module.exports = model('Course', CourseSchema);
