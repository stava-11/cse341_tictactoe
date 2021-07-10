//const path = require('path');
const express = require('express');
const { check, body } = require('express-validator');
const playerController = require('../controllers/player');
const isAuth = require('../middleware/is-auth');
const User = require('../models/user');
const router = express.Router();

router.get('/editUserProfile', isAuth, playerController.getProfile);
router.post('/updateProfile', 
[
    check('name')
        .custom((value, { req }) => {
            return User.findOne({ name: value })
                .then(userDoc => {
                    if (userDoc) {
                        return Promise.reject(
                            'Username exists already. Please pick a different one.'
                        );
                    }
                });
        })
    ],

isAuth, playerController.postUpdateProfile);
router.get('/dashboard', isAuth, playerController.getDashboard);
router.use('/playGame', isAuth, playerController.getPlayGame);
router.post('/postGamePlay', isAuth, playerController.postGamePlay);
router.post('/postPlayerMove', isAuth, playerController.postPlayerMove)

module.exports = router;