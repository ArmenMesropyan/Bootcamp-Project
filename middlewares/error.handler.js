const ErrorResponse = require('../utils/error.response');
const statuses = require('../statuses');

const errorHandler = (err, req, res, next) => {
    let error = {...err, message: err.message};

    // Log for dev
    console.log(err.stack.red);

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        const message = `Resource not found with id of ${err.value}`;

        error = new ErrorResponse(message, 404);
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        const message = 'Found resource with same field';

        error = new ErrorResponse(message, 400, statuses.UNIQUE);
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(e => e.message)[0];

        error = new ErrorResponse(message, 400);
    }

    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Server Error',
        ...(error.status ? {status: error.status} : {}),
    });
};

module.exports = errorHandler;
