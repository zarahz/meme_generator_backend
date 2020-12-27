const express = require('express');
const { authenticateUser } = require('../lib/user');
const { tokenVerification } = require('./middleware');
const { generateToken, validateToken } = require('../util/sign');

const router = express.Router();

// ------------ User specific

/**
 * An Endpoint that decodes token and returns the user, whom id is signed within the token.
 * The user cookie is also set for convenience.
 *
 * res.query: token
 */
router.get('/me', tokenVerification, (req, res) => {
    const { email, username, _id } = req.user;
    return res.status(200).send({ email, username, _id });
});

/**
 * Endpoint to log user in, by checking if a user exists with given username
 * and whether the password matches. On success a token is generated with the user id.
 * Finally a cookie is set containing the token and the token itself is returned.
 *
 * req.body : username, password
 */
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await authenticateUser(username, password);

    if (user.hasOwnProperty("error")) {
        return res.status(400).send({ error: user.error });
    }
    const token = generateToken(user.id);
    res.cookie('token', token, { httpOnly: false });
    // res.cookie('user', JSON.stringify(user), { httpOnly: false });

    return res.status(200).send({ token });
});

module.exports = router;