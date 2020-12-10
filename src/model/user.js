const { Schema, model } = require('mongoose');

const { generateSalt, hash } = require('../util/bcrypt');

const SALT_WORK_FACTOR = 10;

const User = new Schema({
    username: { type: String, unique: true, required: true, trim: true },
    email: { type: String, unique: true, required: true, trim: true },
    password: { type: String, required: true }
}); //required: true // trim: true

/**
 * Method to encrypt password before a user is saved.
 */
User.pre('save', async function callback(next) {
    const user = this;
    if (!user.isModified('password')) return next();

    try {
        // generate a random salt number by passing a fix factor
        const salt = await generateSalt(SALT_WORK_FACTOR);
        // use this salt number to create a modified hash
        // -> ensures security if database is hacked
        const encrypted = await hash(user.password, salt);

        // use this encrypted password for storing and user validation
        user.password = encrypted;
        return next();
    } catch (error) {
        return next(error);
    }
});

module.exports = model('user', User);