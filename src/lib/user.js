const jwt = require('jsonwebtoken');
const { compare } = require('../util/bcrypt');
const { User } = require('../model');
const { generateSalt, hash } = require('../util/bcrypt');
const config = require('../../config');

const SALT_WORK_FACTOR = 10;

/**
 * Gets ONE database user through a queryObject containing attributes and
 * the corresponding filter values. Returns the first matching userobject.
 * i.e. {username: 'admin', ...}
 * @param {*} queryObject
 */
const getUser = async (queryObject) => {
    const user = await User.findOne(queryObject);
    if (!user) { return -1; } // error code -1 is returned for no user found
    return user;
};

/**
 * The username and email values are unique. This Method checks for a value in the 
 * user db column of the given field and gives feedback.
 *
 * Returns false if the value is already taken
 * Returns true if the value is unique
 *
 * @param {String} fieldname of the user db column i.e. "username" or "email"
 * @param {String} value to check for in db column of the given field
 * @param {String} id to ignore (i.e. user updates his info)
 */
const isUnique = async (fieldname, value, id = null) => {
    if (!fieldname) return false;

    const dbElement = await User.findOne({ [fieldname]: value.toLowerCase() });
    if (dbElement && dbElement.id !== id) {
        return false; // error code for no unique value
    }
    return true;
};

/**
 * Creates a new Database entry for the user.
 * @param {*} userObj
 */
const createUser = async (userObj) => {
    const newUser = new User(userObj);
    await newUser.save();
    return newUser;
};

/**
 * This Method authenticates the user upon login. The user is fetched by his username/email from
 * the database and bcrypt compare the hashed password with the entered user password.
 * On success the user is returned.
 * On error the codes -1 for no user found or -2 password fail (=Unauthorized) are returned.
 *
 * @param {String} name
 * @param {String} password
 */
const authenticateUser = async (name, password) => {
    const user = await User.findOne({ $or: [{ username: name }, { email: name }] });//await User.findOne({ username });
    if (!user) {
        return { error: "Authentification Failed. User not found." }
    }
    const success = await compare(password, user.password);
    return success ? user : { error: "Authentification Failed. Wrong Password." };
};

/**
 * Updates the user password. Return a status for success or error.
 * @param {String} _id
 * @param {String} newPassword
 */
const updatePassword = async (_id, newPassword) => {
    if (!newPassword) { return { error: 'empty_password' } }
    // fetch the user by id
    const user = await User.findOne({ _id });
    if (!user) { return { error: 'no_user_found' } }

    try { // try to encrypt the new password
        // generate a random salt number by passing a fix factor
        const salt = await generateSalt(SALT_WORK_FACTOR);
        // use this salt number to create a modified hash
        const encrypted = await hash(newPassword, salt);

        // update password of the user
        const update = { password: encrypted };
        const updated = await User.findOneAndUpdate({ _id }, update);
        if (!updated) { return { error: 'Update failed.' } }

        return update;
    } catch (error) {
        return { error: 'encryption_failed' };
    }
};

/**
 * Deletes a user by his/her username. Returns false if no user is found.
 *
 * @param {String} username
 */
const deleteUser = async (username) => {
    const deleted = await User.findOneAndDelete({ username });
    if (!deleted) { return false; }
    return true;
};

/**
 * Get all Users.
 */
const getUsers = async () => {
    const users = await User.find({});
    return users;
};


/**
 * Verifies the jwt token is valid and extracts the userid embedded in it. The user with this id
 * is then fetched and returned. If no user is found the error code -1 is returned.
 * @param {String} token
 */
const authenticateUserByJWT = async (token) => new Promise((resolve, reject) => {
    jwt.verify(token, config.secret, async (err, decoded) => {
        if (err) return reject(err);
        const user = await getUser({ _id: JSON.parse(decoded) });
        return (user === -1) ? resolve(-1) : resolve(user);
    });
});


/**
 * Updates a user with the provided user id with the object containing the changed elements.
 * The userobject can only contain the attribute and value which is updated
 * (no full user object needed).
 *
 * @param {String} id
 * @param {*} userObj
 */
const updateUser = async (id, userObj) => {
    if (userObj.hasOwnProperty("password")) {
        let updatePWResult = await updatePassword(id, userObj.password);
        if (updatePWResult.hasOwnProperty("error")) {
            return updatePWResult;
        }
        delete userObj.password;
    }
    // check if the username and email can be updated
    if (userObj.hasOwnProperty("username")) {
        const uniqueUsername = await isUnique("username", userObj.username, id); //userObj.username, userObj.email, id);
        if (!uniqueUsername) return { error: "Username already exists" };
    }
    if (userObj.hasOwnProperty("email")) {
        const uniqueEmail = await isUnique("email", userObj.email, id); //userObj.username, userObj.email, id);
        if (!uniqueEmail) return { error: "Email already exists" };
    }

    // filter the db for the id, update the entry and return the updated object
    const filter = { _id: id };
    const userUpdated = await User.findOneAndUpdate(filter, userObj, { new: true });
    // if no user is found or something went wrong the method returns null
    // else the updated user is returned
    return (userUpdated) ? userUpdated : { error: "No user found." };
};

module.exports = {
    createUser,
    deleteUser,
    authenticateUser,
    authenticateUserByJWT,
    getUser,
    updateUser,
    updatePassword,
    getUsers,
    isUnique
};