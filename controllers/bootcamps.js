const path = require('path');
const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/error.response');
const asyncHandler = require('../middlewares/async.handler');

// @desc        Get all bootcamps
// @route       GET /api/v1/bootcamps
// @access      Public
exports.getAllBootcamps = asyncHandler(async (req, res) => {
    // advanced.results middleware for sorting, filtering, etc..
    const {advancedResults} = req;

    res.status(200).json(advancedResults);
});

// @desc        Get bootcamp
// @route       GET /api/v1/bootcamps/:id
// @access      Public
exports.getSingleBootcamp = asyncHandler(async (req, res, next) => {
    const {id} = req.params;

    const bootcamp = await Bootcamp.findById(id).populate('courses');

    if (!bootcamp) {
        return next(
            new ErrorResponse(
                `Bootcamp not found with id of ${req.params.id}`,
                404,
            ),
        );
    }

    res.status(200).json({
        success: true,
        data: bootcamp,
    });
});

// @desc        Create new bootcamp
// @route       POST /api/v1/bootcamps/:id
// @access      Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
    const user = req.user.id;

    // Check for published bootcamp
    const publishedBootcamp = await Bootcamp.findOne({user});

    // If the user not an admin, he can't add more than one bootcamp
    if (req.user.role !== 'admin' && publishedBootcamp) {
        return next(
            new ErrorResponse(
                `${req.user.email} already has a published bootcamp`,
                400,
            ),
        );
    }

    const bootcamp = await Bootcamp.create({...req.body, user});

    res.status(201).json({
        success: true,
        msg: 'Created new bootcamp',
        data: bootcamp,
    });
});

// @desc        Update the bootcamp
// @route       PUT /api/v1/bootcamps/:id
// @access      Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
    const {id} = req.params;

    let bootcamp = await Bootcamp.findById(id);

    if (!bootcamp) {
        return next(new ErrorResponse('Invalid id for bootcamp', 400));
    }

    if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(
            new ErrorResponse(
                `User ${req.user.email} is not authorized to update this bootcamp`,
                401,
            ),
        );
    }

    bootcamp = await Bootcamp.findOneAndUpdate(req.body, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({
        success: true,
        data: bootcamp,
    });
});

// @desc        Delete the bootcamp
// @route       DELETE /api/v1/bootcamps/:id
// @access      Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
    const {id} = req.params;

    const bootcamp = await Bootcamp.findById(id);

    if (!bootcamp) {
        return next(new ErrorResponse('Invalid id for bootcamp', 400));
    }

    if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(
            new ErrorResponse(
                `User ${req.user.email} is not authorized to delete this bootcamp`,
                401,
            ),
        );
    }

    await bootcamp.remove();

    res.status(200).json({
        success: true,
        data: {},
    });
});

// @desc        Get bootcamps by geolocation
// @route       GET /api/v1/bootcamps/radius/:distance
// @access      Public
exports.getBootcampsInRadius = asyncHandler(async (req, res) => {
    const {distance} = req.params;
    const {lat, lng} = req.body;

    // Calc distance meter
    const meterDistance = distance * 1000;

    const bootcamps = await Bootcamp.find({
        location: {
            $near: {
                $geometry: {
                    type: 'Point',
                    coordinates: [lng, lat],
                },
                $maxDistance: meterDistance,
            },
        },
    });

    res.status(200).json({
        success: true,
        count: bootcamps.length,
        data: bootcamps,
    });
});

// @desc        Upload photo for bootcamp
// @route       PUT /api/v1/bootcamps/:id/photo
// @access      Private
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
    const {id} = req.params;

    const bootcamp = await Bootcamp.findById(id);

    // Custom validations

    if (!bootcamp) {
        return next(new ErrorResponse('Invalid id for bootcamp', 400));
    }

    if (!req.files) {
        return next(new ErrorResponse('Please upload a file', 400));
    }

    const {file} = req.files;

    // Make sure the image is photo

    if (!file.mimetype.includes('image')) {
        return next(new ErrorResponse('Please upload an image', 400));
    }

    // Check file size

    if (file.size > process.env.MAX_FILE_UPLOAD) {
        return next(
            new ErrorResponse(
                `Please upload an image less than ${process.env.MAX_FILE_UPLOAD} byte`,
                400,
            ),
        );
    }

    // Create custom filename
    file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

    // Upload the file
    try {
        await file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`);
    } catch (error) {
        console.error(error);
        return next(new ErrorResponse('Problem with file upload', 500));
    }

    if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(
            new ErrorResponse(
                `User ${req.user.email} is not authorized to update this bootcamp`,
                401,
            ),
        );
    }

    await bootcamp.update({photo: file.name});

    res.status(200).json({
        success: true,
        message: `${file.name} successfully uploaded`,
    });
});
