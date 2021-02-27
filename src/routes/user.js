const express = require('express');
//const axios = require('axios').default;
const {
    createUser, deleteUser, authenticateUser, authenticateUserByJWT, getUser, updateUser, updatePassword, getUsers, isUnique
} = require('../lib/user');
const { generateToken } = require('../util/sign');
const { tokenVerification } = require('./middleware');

const router = express.Router();

/**
 * Endpoint to check if user input is unique
 *
 * body: user information i.e. {field: "username", value: "test"}
 */
router.post('/is-unique', async (req, res) => {
    const { field, value } = req.body
    try {
        const uniqueValue = await isUnique(field, value);

        if (uniqueValue) {
            return res.status(204).end();
        }

        return res.status(400).send({ error: `${field.replace(/\b\w/g, l => l.toUpperCase())} with the value '${value}' already exists! Please try something else.` });
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
});

/**
 * Endpoint to enable user registration. After storing the new user successfully in the
 * database a token is generated, returned and stored as cookie.
 * On failure an error message with respective status is returned.
 *
 * body: user object to be registered
 */
router.post('/register', async (req, res) => {
    try {
        const user = await createUser(req.body);
        if (user && Object.keys(user).length !== 0) {
            const token = generateToken(user.id);
            res.cookie('token', token, { httpOnly: false });
            return res.status(200).send({ token });
        }
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
    return res.status(500).send({ error: 'error' });
});

/**
 * Endpoint to get all users
 *
 * query: token
 */
router.get('/users', tokenVerification, async (req, res) => {
    let users = [];
    users = await getUsers();
    return res.status(200).send({ users });
});

/**
 * Endpoint to get user with a specific id.
 *
 * query: token, id
 */
router.get('/user-by-id', tokenVerification, async (req, res) => {
    const id = { _id: req.query.id };
    const user = await getUser(id);
    if (user === -1) { return res.status(403).send({ error: 'no user found' }); }
    return res.status(200).send({ user });
});


/**
 * Endpoint to update a user.
 *
 * params: id
 * query: token
 * body: object containing new values
 */
router.patch('/update-user/:id', tokenVerification, async (req, res) => {
    try {
        const { id } = req.params;
        const updatedUser = await updateUser(id, req.body);
        if (updatedUser.id) {
            const token = generateToken(updatedUser.id);
            return res.status(200).send({ token });
        }
        return res.status(400).send(updatedUser);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).send({ error: 'duplicate-key', duplicate: error.keyValue });
        }
        return res.status(500).send({ error: error.errmsg });
    }
});

/**
 * Endpoint to update the password of a user.
 *
 * params: id
 * query: token
 * body: newPassword
 */
router.patch('/update-password/:id', tokenVerification, async (req, res) => {
    const { password } = req.body;
    const { id } = req.params;
    const updateResult = await updatePassword(id, password);
    if (updateResult.id) {
        return res.send(200).end();
    }
    return res.status(400).send(updateResult);
});

/**
 * Endpoint to delete a user.
 *
 * query: token
 * body: username, password
 */
router.post('/deleteUser', tokenVerification, async (req, res) => {
    const { username, password } = req.body;
    const user = await authenticateUser(username, password);

    // check if user is authenticated
    if (user === -1) {
        return res.status(403).send({ error: 'no user found' });
    }
    if (user === -2) {
        return res.status(401).send({ error: 'Unauthorized!' });
    }
    // cancel events that are hosted by the user
    /*await axios.put(`https://pwp.um.ifi.lmu.de/g05/events/leave/${user.id}/${req.query.token}?account_id=${user.id}`)
        .then((response) => {
            if (response.status !== 200) {
                return res.status(500).send({ error: 'Deletion failed' });
            }
            return response.data;
        })
        .catch(() => res.status(500).send({ error: 'Deletion failed' }));
    */

    // delete user in database
    const deleted = await deleteUser(username);
    if (!deleted) {
        return res.status(500).send({ error: 'Deletion failed' });
    }

    // delete user in cookies
    res.clearCookie('token');
    res.clearCookie('user');

    return res.status(200).end();
});

module.exports = router;