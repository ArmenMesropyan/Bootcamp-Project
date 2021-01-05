const jwt = require('jsonwebtoken');
const asyncHandler = require('./async.handler');
const ErrorResponse = require('../utils/error.response');
const User = require('../models/User');

exports.authMiddleware = asyncHandler(async (req, res, next) => {
    const {authorization} = req.headers;

    let token;

    if (authorization && authorization.startsWith('Bearer')) {
        token = authorization.split(' ')[1];
    } else if (req.cookies.token) {
        token = req.cookies.token;
    }

    // Make sure token exists
    if (!token) {
        return next(new ErrorResponse('Unauthorized!', 401));
    }

    try {
        const user = await jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findById(user.id);

        next();
    } catch (error) {
        return next(new ErrorResponse('Unauthorized!', 401));
    }
});

exports.roleMiddleware = (...roles) => (req, res, next) => {
    const {role} = req.user;

    if (!roles.includes(role)) {
        next(
            new ErrorResponse(`Role ${role} doesn't access to this route`, 403),
        );
    }

    next();
};
