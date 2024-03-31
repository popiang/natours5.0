const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const AppError = require('../utils/appError');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        minLength: [5, 'A name must be equal or longer than 5 characters'],
        maxLength: [50, 'A name must be equal or shorter than 5 characters'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        trim: true,
        unique: true,
        validate: [validator.isEmail, 'Please provide a valid email'],
    },
    role: {
        type: String,
        enum: ['admin', 'guide-lead', 'guide', 'user'],
        default: 'user',
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        trim: true,
        minLength: [8, 'Password must be equal or more than 8 characters'],
        select: false,
    },
    confirmPassword: {
        type: String,
        required: [true, 'Please provide a confirm password'],
        trim: true,
        validate: {
            validator: function (val) {
                return this.password === val;
            },
            message: 'Passwords do not match',
        },
    },
    passwordChangeAt: {
        type: Date,
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default: true,
    },
});

userSchema.pre('save', async function (next) {
    // only run this function if password was modified
    if (!this.isModified('password')) {
        return next();
    }
    // hash the password
    this.password = await bcrypt.hash(this.password, 12);

    // delete confirmPassword
    this.confirmPassword = undefined;

    next();
});

userSchema.pre('save', function (next) {
    if (!this.isModified('password') || this.isNew) {
        return next();
    }

    this.passwordChangeAt = Date.now() - 1000;
    next();
});

userSchema.pre(/^find/, function (next) {
    this.find({ active: { $ne: false } });
    next();
});

userSchema.methods.correctPassword = async function (
    candidatePassword,
    userPassword
) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changePasswordAfter = function (JWTTimestamp) {
    if (!this.passwordChangeAt) {
        return false;
    }

    const changedTimestamp = parseInt(
        this.passwordChangeAt.getTime() / 1000,
        10
    );

    return JWTTimestamp < changedTimestamp;
};

userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
