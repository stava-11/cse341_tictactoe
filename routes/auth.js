const express = require('express');
//const path = require('path');
const { check, body } = require('express-validator');// /check
const authController = require('../controllers/auth');
const User = require('../models/user');
const router = express.Router();

router.get('/login', authController.getLogin);
router.get('/signup', authController.getSignup);
router.post(
    '/login',
    [
        body('email')
            .isEmail()
            .withMessage('Please enter a valid email.')
            .normalizeEmail(),
        body('password', 'Password must be 4 alphanumeric characters')
            .isLength({ min: 4 })
            .isAlphanumeric()
            .trim()
    ],
    authController.postLogin
);

router.post(
    '/signup',
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
            }),

        check('email')
            .isEmail()
            .withMessage('Please enter a valid email.')
            .custom((value, { req }) => {
               
                return User.findOne({ email: value })
                    .then(userDoc => {
                        if (userDoc) {
                            return Promise.reject(
                                'Email exists already. Please pick a different one.'
                            );
                        }
                    });
            })
            .normalizeEmail(),
        body('password',
            'Please enter a password with only numbers and text and at least 5 characters.'
        )
            .isLength({ min: 5 })
            .isAlphanumeric()
            .trim(),
        body('confirmPassword')
            .trim()
            .custom((value, { req }) => {
                if (value !== req.body.password) {
                    throw new Error('Passwords have to match!');
                }
                return true;
            })
    ],
    authController.postSignup);
router.post('/logout', authController.postLogout);
router.get('/', authController.getIndex);
router.get('/reset', authController.getReset);
router.post('/reset', authController.postReset);
router.get('/reset/:token', authController.getNewPassword);
router.post('/newPass', authController.postNewPassword);

module.exports = router;