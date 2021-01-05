const User = require('../models/User');
const ErrorResponse = require('../utils/error.response');
const asyncHandler = require('../middlewares/async.handler');
const crypto = require('crypto');
const sendEmail = require('../utils/send.email');
const sendTokenResponse = require('../utils/send.token.response');

// @desc        Register a user
// @route       POST /api/v1/auth/register
// @access      Public
exports.registerUser = asyncHandler(async (req, res, next) => {
    const {name, email, password, role} = req.body;

    // Create user

    const user = await User.create({
        name,
        email,
        password,
        role,
    });

    sendTokenResponse(user, 200, res);
});

// @desc        Login a user
// @route       POST /api/v1/auth/login
// @access      Public
exports.loginUser = asyncHandler(async (req, res, next) => {
    const {email, password} = req.body;

    if (!email || !password) {
        return next(new ErrorResponse('Email and password is required', 400));
    }

    // Check is valid email

    const user = await User.findOne({
        email,
    }).select('+password');

    if (!user) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    // Check is valid password

    const isValidPassword = await user.matchPassword(password);

    if (!isValidPassword) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    sendTokenResponse(user, 200, res);
});

// @desc        Login a user
// @route       POST /api/v1/auth/me
// @access      Public
exports.getMe = asyncHandler(async (req, res, next) => {
    res.status(200).json({
        success: true,
        data: req.user,
    });
});

// @desc        Send email for forgot password
// @route       POST /api/v1/auth/forgot
// @access      Public
exports.sendForgotEmail = asyncHandler(async (req, res, next) => {
    const {email} = req.body;

    const user = await User.findOne({email});

    if (!user) {
        return next(
            new ErrorResponse(`There is no user with email - ${email}`, 404),
        );
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();

    // Save user model after calling getResetPasswordToken
    await user.save({validateBeforeSave: false});

    try {
        await sendEmail({
            to: email,
            subject: 'Email for reset password ✔',
            text: 'Reset password',
            html: `
            <b>You receive this email, because you or something else want's to update your password</b>
            <a target="_blank" href="${req.protocol}://${req.get(
                'host',
            )}/forgotpassword/${resetToken}">
                Just visit this url for that
            </a>
            `,
        });

        console.log(resetToken);

        res.status(200).json({
            success: true,
            message: 'Email sent',
        });
    } catch (error) {
        console.error(error);

        user.resetPasswordExpired = undefined;
        user.resetPasswordToken = undefined;

        await user.save({validateBeforeSave: false});

        next(new ErrorResponse("Can't send email", 500));
    }
});

// @desc        Send email for forgot password
// @route       PUT /api/v1/auth/forgot/update/:resetToken
// @access      Public
exports.updatePassword = asyncHandler(async (req, res, next) => {
    const {resetToken} = req.params;
    const {newPassword} = req.body;

    // Get hashed token
    const resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpired: {$gt: Date.now()},
    });

    if (!user) {
        return next(new ErrorResponse(`Invalid token: ${resetToken}`, 400));
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpired = undefined;

    await user.save();

    sendTokenResponse(user, 200, res);
});
