class ErrorResponse extends Error {
    constructor(message, statusCode, status) {
        super(message);

        if (status) this.status = status;

        this.statusCode = statusCode;
    }
}

module.exports = ErrorResponse;
