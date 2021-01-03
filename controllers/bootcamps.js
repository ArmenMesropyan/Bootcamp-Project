const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/error.response');
const asyncHandler = require('../middlewares/async.handler');

// @desc        Get all bootcamps
// @route       GET /api/v1/bootcamps
// @access      Public
exports.getAllBootcamps = asyncHandler(async (req, res, next) => {
    const bootcamps = await Bootcamp.find();

    res.status(200).json({
        success: true,
        count: bootcamps.length,
        data: bootcamps,
    });
});

// @desc        Get bootcamp
// @route       GET /api/v1/bootcamps/:id
// @access      Public
exports.getSingleBootcamp = asyncHandler(async (req, res, next) => {
    const {id} = req.params;

    const bootcamp = await Bootcamp.findById(id);

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
    const bootcamp = await Bootcamp.create(req.body);

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

    const bootcamp = await Bootcamp.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
    });

    if (!bootcamp) {
        return next(new ErrorResponse('Invalid id for bootcamp', 400));
    }

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

    const bootcamp = await Bootcamp.findByIdAndDelete(id);

    if (!bootcamp) {
        return next(new ErrorResponse('Invalid id for bootcamp', 400));
    }

    res.status(200).json({
        success: true,
        data: {},
    });
});
