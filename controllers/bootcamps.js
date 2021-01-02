// @desc        Get all bootcamps
// @route       GET /api/v1/bootcamps
// @access      Public
exports.getAllBootcamps = (req, res, next) => {
    res.status(200).json({success: true, msg: 'Show all bootcamps'});
};

// @desc        Get bootcamp
// @route       GET /api/v1/bootcamps/:id
// @access      Public
exports.getSingleBootcamp = (req, res, next) => {
    res.status(200).json({success: true, msg: 'Show bootcamp'});
};

// @desc        Create new bootcamp
// @route       POST /api/v1/bootcamps/:id
// @access      Private
exports.createBootcamp = (req, res, next) => {
    res.status(200).json({success: true, msg: 'Create new bootcamp'});
};

// @desc        Update the bootcamp
// @route       PUT /api/v1/bootcamps/:id
// @access      Private
exports.updateBootcamp = (req, res, next) => {
    res.status(200).json({
        success: true,
        msg: `Update the bootcamp ${req.params.id}`,
    });
};

// @desc        Delete the bootcamp
// @route       DELETE /api/v1/bootcamps/:id
// @access      Private
exports.deleteBootcamp = (req, res, next) => {
    res.status(200).json({
        success: true,
        msg: `Delete the bootcamp ${req.params.id}`,
    });
};
