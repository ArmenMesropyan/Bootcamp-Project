const Bootcamp = require('../models/Bootcamp');
const statuses = require('../statuses');

// @desc        Get all bootcamps
// @route       GET /api/v1/bootcamps
// @access      Public
exports.getAllBootcamps = async (req, res) => {
    try {
        const bootcamps = await Bootcamp.find();

        res.status(200).json({
            success: true,
            count: bootcamps.length,
            data: bootcamps,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
        });
    }
};

// @desc        Get bootcamp
// @route       GET /api/v1/bootcamps/:id
// @access      Public
exports.getSingleBootcamp = async (req, res) => {
    try {
        const {id} = req.params;

        const bootcamp = await Bootcamp.findById(id);

        if (!bootcamp) {
            res.status(400).json({
                success: false,
                message: 'Invalid id for bootcamp',
            });
        }

        res.status(200).json({
            success: true,
            data: bootcamp,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
        });
    }
};

// @desc        Create new bootcamp
// @route       POST /api/v1/bootcamps/:id
// @access      Private
exports.createBootcamp = async (req, res) => {
    try {
        const isSameBootcamp = await Bootcamp.findOne({name: req.body.name});

        if (isSameBootcamp) {
            return res.status(400).json({
                success: false,
                message: 'Bootcamp name must be an unique',
                status: statuses.UNIQUE,
            });
        }

        const bootcamp = await Bootcamp.create(req.body);

        res.status(201).json({
            success: true,
            msg: 'Created new bootcamp',
            data: bootcamp,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
        });
    }
};

// @desc        Update the bootcamp
// @route       PUT /api/v1/bootcamps/:id
// @access      Private
exports.updateBootcamp = async (req, res) => {
    try {
        const {id} = req.params;

        const isSameBootcamp = await Bootcamp.findOne({name: req.body.name});

        if (isSameBootcamp && isSameBootcamp._id.toString() !== id) {
            return res.status(400).json({
                success: false,
                message: 'Bootcamp name must be an unique',
                status: statuses.UNIQUE,
            });
        }

        const bootcamp = await Bootcamp.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!bootcamp) {
            res.status(400).json({
                success: false,
                message: 'Invalid id for bootcamp',
            });
        }

        res.status(200).json({
            success: true,
            data: bootcamp,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
        });
    }
};

// @desc        Delete the bootcamp
// @route       DELETE /api/v1/bootcamps/:id
// @access      Private
exports.deleteBootcamp = async (req, res) => {
    try {
        const {id} = req.params;

        const bootcamp = await Bootcamp.findByIdAndDelete(id);

        if (!bootcamp) {
            res.status(400).json({
                success: false,
                message: 'Invalid id for bootcamp',
            });
        }

        res.status(200).json({
            success: true,
            data: {},
        });
    } catch (error) {
        res.status(500).json({
            success: false,
        });
    }
};
