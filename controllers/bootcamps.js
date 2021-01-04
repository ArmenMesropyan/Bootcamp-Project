const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/error.response');
const asyncHandler = require('../middlewares/async.handler');

// @desc        Get all bootcamps
// @route       GET /api/v1/bootcamps
// @access      Public
exports.getAllBootcamps = asyncHandler(async (req, res) => {
    // Selecting select field to select specific fields
    const {select, sort, limit = 10, page = 1, ...requestQuery} = req.query;

    // Create operators ($gt, $gte, etc...)
    const queryStr = JSON.stringify(requestQuery).replace(
        /\b(gt|gte|lt|lte|in)\b/g,
        match => `$${match}`,
    );

    const startIndex = (page - 1) * limit;
    const total = await Bootcamp.countDocuments();

    let query = Bootcamp.find(JSON.parse(queryStr))
        .skip(startIndex)
        .limit(+limit)
        .populate('courses');

    if (select) query = query.select(select.split(',').join(' '));

    if (sort) query = query.sort(sort);
    else query = query.sort('-createdAt');

    const bootcamps = await query;

    // Calculate page count

    const pageCount = total / limit < 1 ? 0 : Math.ceil(total / limit);

    res.status(200).json({
        success: true,
        currentPage: +page,
        pageSize: +limit,
        pageCount,
        count: bootcamps.length,
        data: bootcamps,
    });
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
