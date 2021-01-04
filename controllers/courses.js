const Course = require('../models/Course');
const ErrorResponse = require('../utils/error.response');
const asyncHandler = require('../middlewares/async.handler');
const Bootcamp = require('../models/Bootcamp');

// @desc        Get courses
// @route       GET /api/v1/courses
// @route       GET /api/v1/bootcamps/courses/:bootcampId
// @access      Public
exports.getCourses = asyncHandler(async (req, res, next) => {
    let query;

    if (req.params.bootcampId)
        query = Course.find({bootcamp: req.params.bootcampId});
    else query = Course.find();

    const courses = await query.populate({
        path: 'bootcamp',
        select: 'name description',
    });

    res.status(200).json({
        success: true,
        count: courses.length,
        data: courses,
    });
});

// @desc        Get single course
// @route       GET /api/v1/courses/:id
// @access      Public
exports.getSingleCourse = asyncHandler(async (req, res, next) => {
    const {id} = req.params;

    const course = await Course.findById(id).populate({
        path: 'bootcamp',
        select: 'name description',
    });

    if (!course) {
        return next(new ErrorResponse(`No course found with id of ${id}`, 404));
    }

    res.status(200).json({
        success: true,
        data: course,
    });
});

// @desc        Add course
// @route       POST /api/v1/bootcamps/courses/:bootcampId
// @access      Private
exports.createCourse = asyncHandler(async (req, res, next) => {
    const {bootcampId} = req.params;

    req.body.bootcamp = bootcampId;

    const bootcamp = await Bootcamp.findById(bootcampId);

    if (!bootcamp) {
        return next(
            new ErrorResponse(
                `No bootcamp found with id of ${bootcampId}`,
                404,
            ),
        );
    }

    const course = await Course.create(req.body);

    res.status(201).json({
        success: true,
        data: course,
    });
});

// @desc        Update course
// @route       PUT /api/v1/courses/:id
// @access      Private
exports.updateCourse = asyncHandler(async (req, res, next) => {
    const {id} = req.params;

    const course = await Course.findByIdAndUpdate(id, req.body, {
        runValidators: true,
        new: true,
    });

    if (!course) {
        return next(new ErrorResponse(`No course found with id of ${id}`, 404));
    }

    res.status(200).json({
        success: true,
        data: course,
    });
});

// @desc        Delete course
// @route       DELETE /api/v1/courses/:id
// @access      Private
exports.deleteCourse = asyncHandler(async (req, res, next) => {
    const {id} = req.params;

    const course = await Course.findByIdAndRemove(id);

    if (!course) {
        return next(new ErrorResponse(`No course found with id of ${id}`, 404));
    }

    res.status(200).json({
        success: true,
    });
});
