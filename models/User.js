const {Schema, model} = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const UserSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'User name is required'],
            unique: true,
        },
        email: {
            required: [true, 'User email is required'],
            type: String,
            unique: true,
            match: [
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                'Please add a valid email',
            ],
        },
        role: {
            type: String,
            enum: ['user', 'publisher'],
            default: 'user',
        },
        password: {
            type: String,
            required: [true, 'User password is required'],
            minlength: 6,
            select: false,
        },
        resetPasswordToken: String,
        resetPasswordExpired: Date,
    },
    {
        timestamps: true,
    },
);

// Encrypt password using bcrypt

UserSchema.pre('save', async function (next) {
    if (!this.password) {
        return next();
    }

    const salt = await bcrypt.genSalt(10);

    this.password = await bcrypt.hash(this.password, salt);

    next();
});

// Sign JWT and return

UserSchema.methods.getSignedJwtToken = function () {
    return jwt.sign({id: this._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

// Match user entered password with hashed password

UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Generate reset password token
UserSchema.methods.getResetPasswordToken = function () {
    // Generate token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash token and set to resetPasswordToken field
    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    // Set expire
    this.resetPasswordExpired = Date.now() + 10 * 60 * 1000;

    return resetToken;
};

module.exports = model('User', UserSchema);
