import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    photo: {
        type: String
    },
    isGoogleUser: {
        type: Boolean,
        default: false
    },
    googleId: {
        type: String,
        required: function() {
            return this.isGoogleUser;
        }
    },
    password: {
        type: String,
        required: function(){
            return !this.isGoogleUser
        }
    },
    rooms: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room'
    }],
    requestedRooms: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room'
    }],
    refreshToken: {
        type: String
    },
    passwordResetToken: {
        type: String
    },
    passwordResetTokenExpiry: {
        type: Date
    }
}, {timestamps: true});

userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) return next()
    this.password = await bcrypt.hash(this.password, 10);
    next();
})

userSchema.methods.isValidPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateRefreshToken = function() {
    return jwt.sign(
        {
            _id: this._id,
            userName: this.userName,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateAccessToken = function() {
    return jwt.sign(
        {
            _id: this._id,
            userName: this.userName,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.createResetPasswordToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    this.passwordResetTokenExpiry = Date.now() + 10 * 60 * 1000;

    return resetToken
}

export const User = mongoose.model('User', userSchema);