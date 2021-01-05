const User = require('../models/User');
const ErrorResponse = require('../utils/error.response');
const asyncHandler = require('../middlewares/async.handler');
const sendTokenToUser = require('../utils/send.token.response');

// @desc        Update a user details
// @route       PUT /api/v1/account/details
// @access      Private
exports.updateDetails = asyncHandler(async (req, res) => {
    const {name, email} = req.body;

    const fieldsToUpdate = {email, name};

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate);

    res.status(200).json({
        success: true,
        data: user,
    });
});

// @desc        Update a user password
// @route       PUT /api/v1/account/password
// @access      Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
    const {currentPassword, password} = req.body;

    const user = await User.findById(req.user.id).select('+password');

    if (!(await user.matchPassword(currentPassword))) {
        return next(new ErrorResponse('Password is incorrect', 400));
    }

    user.password = password;

    await user.save();

    sendTokenToUser(user, 200, res);
});
