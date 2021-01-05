const User = require('../models/User');
const ErrorResponse = require('../utils/error.response');
const asyncHandler = require('../middlewares/async.handler');

// @desc        Get all users
// @route       GET /api/v1/users
// @access      Private/Admin
exports.getAllUsers = asyncHandler(async (req, res, next) => {
    res.status(200).json(req.advancedResults);
});

// @desc        Get all users
// @route       GET /api/v1/users/:userId
// @access      Private/Admin
exports.getSingleUser = asyncHandler(async (req, res, next) => {
    const {userId} = req.params;

    const user = await User.findById(userId);

    if (!user) {
        return next(
            new ErrorResponse(`There are no user with id of ${userId}`, 404),
        );
    }

    res.status(200).json({
        success: true,
        data: user,
    });
});

// @desc        Add new user
// @route       POST /api/v1/users
// @access      Private/Admin
exports.createUser = asyncHandler(async (req, res, next) => {
    const {name, email, password, role} = req.body;

    // Create user

    const user = await User.create({
        name,
        email,
        password,
        role,
    });

    res.status(200).json({
        success: true,
        data: user,
    });
});

// @desc        Update the user
// @route       PUT /api/v1/users/:userId
// @access      Private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
    const {userId} = req.params;

    const {name, email, password, role} = req.body;

    // Create user

    const user = await User.findById(userId);

    if (!user) {
        return next(new ErrorResponse(`Invalid user id: ${userId}`, 404));
    }

    user.name = name;
    user.email = email;
    user.password = password;
    user.role = role;

    await user.save();

    res.status(200).json({
        success: true,
        data: user,
    });
});

// @desc        Delete the user
// @route       DELETE /api/v1/users/:userId
// @access      Private/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
    const {userId} = req.params;

    await User.findByIdAndDelete(userId);

    res.status(200).json({
        success: true,
        data: {},
    });
});
