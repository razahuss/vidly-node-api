const Joi = require('joi');
const passwordComplexity = require('joi-password-complexity');
const mongoose = require('mongoose');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const config = require('config');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
    },
    isAdmin: Boolean
});

userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get('jwtPrivateKey'));
    return token;
}

const User = mongoose.model('User', userSchema);

function validatePassword(password) {
    const passwordComplexity = {
        min: 8,
        max: 30,
        lowerCase: 1,
        upperCase: 1,
        numeric: 1
    };
    return Joi.validate(password, new passWordComplexity(this.passwordComplexity));
}

function validateUser(user) {
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().required()
    });

    return schema.validate({
        name: user.name,
        email: user.email,
        password: user.password
    });

    //return schema.validate(_.pick([ 'name', 'email', 'password']));

};

exports.User = User;
exports.validatePassword = validatePassword;
exports.validate = validateUser;