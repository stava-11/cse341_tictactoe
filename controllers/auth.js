const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const { validationResult } = require('express-validator');// /check

const User = require('../models/user');
const GamePlay = require('../models/gamePlay');

const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const fetch = require('node-fetch');

const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: process.env.API_KEY
    }
}));

    
exports.getIndex = (req, res, next) => {
    res.render('index', {
        pageTitle: 'tictactoe home',
        path: '/',
    });
};


exports.getLogin = (req, res, next) => {
    console.log(req.flash('error'));
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('login', {//auth
        path: '/login',
        pageTitle: 'Login',
        errorMessage: message,
        oldInput: {
            email: '',
            password: ''
        },
        validationErrors: []
    });
};


exports.getSignup = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('registration', {//auth
        path: '/signup',
        pageTitle: 'Signup',
        errorMessage: message,
        oldInput: {
            name: '',
            email: '',
            password: '',
            confirmPassword: ''
        },
        validationErrors: []

    });
};

//*************************************************/
//
// This takes the user to the dashboard and provides
// data for the players and current games
//
//*************************************************/
exports.postLogin = (req, res, next) => {

    const email = req.body.email;
    const password = req.body.password;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).render('login', {//auth/
            path: '/login',
            pageTitle: 'Login',
            errorMessage: errors.array()[0].msg,
            oldInput: {
                email: email,
                password: password
            },
            validationErrors: errors.array()
        });
    }


    User.findOne({ email: email })
        .then(currentUser => {
            if (!currentUser) {

                return res.status(422).render('login', {//auth/
                    path: '/login',
                    pageTitle: 'Login',
                    errorMessage: 'Invalid email or password.',
                    oldInput: {
                        email: email,
                        password: password

                    },
                    validationErrors: []
                });
            };
            return bcrypt
                .compare(password, currentUser.password)
                .then(doMatch => {
                    if (doMatch) {
                        req.session.isLoggedIn = true;
                        req.session.user = currentUser;
                        if (req.body.longitude && req.body.latitude){
                            req.session.latitude = req.body.latitude;
                            req.session.longitude = req.body.longitude;
                        } else {
                            req.session.latitude = null;
                            req.session.longitude = null;
                        }
                        req.session.save();
                        return currentUser;
                    } else {
                        return res.status(422).render('login', {//auth/
                        path: '/login',
                        pageTitle: 'Login',
                        errorMessage: 'Invalid email or password.',
                        oldInput: {
                            email: email,
                            password: password

                        },
                        validationErrors: []//[{param: 'email', param: 'password'}]
                        });
                    };
                })
                .catch(err => {
                    console.log(err);
                    res.redirect('login');
                });
        })
        .then(currentUser => {
            console.log('latitude');
            console.log(req.session.latitude);
            if (req.session.latitude != null && req.session.longitude != null) {
                const apiURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${req.session.latitude}&lon=${req.session.longitude}&units=imperial&appid=${WEATHER_API_KEY}`;
                return fetch(apiURL)
                .then(response => response.json())
                .then(jsObject => {
                    req.session.weather = jsObject;
                    req.session.save();
                    return jsObject
                });
            } else {
                req.session.weather = null;
                req.session.save();
                jsObject = null;
                return jsObject
            }
        })
        .then(jsObject  => {
            const players = User.find();
            return players;
        })
        .then(players => {
            req.session.players = players;  
            req.session.save();
            return players;
        })
        .then(players => {
            const games = GamePlay.find({
                $or: [
                    { player1: req.session.user },
                    { player2: req.session.user }
                ]
            });
            return games;
        })
        .then(games => {
            res.render('dashboard', {
                games: games,
                players: req.session.players,
                user: req.session.user,
                weather: req.session.weather,
                pageTitle: 'Dashboard', 
                path: '/dashboard' 
            });        
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });

};

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
    });
}

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;
    if (req.session.weather) {
        req.session.weather = null;
    }
    // const country = req.body.country;
    //const confirmPassword = req.body.confirmPassword;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array());
        return res.status(422).render('registration', { //auth/
            path: '/signup',
            pageTitle: 'Signup',
            errorMessage: errors.array()[0].msg,
            oldInput: {
                name: name,
                email: email,
                password: password,
                confirmPassword: req.body.confirmPassword
            },
            validationErrors: errors.array()
        });
    }
    
    bcrypt
        .hash(password, 12)
        .then(hashedPassword => {
            const user = new User({
                name: name,
                email: email,
                password: hashedPassword
            });
            return user.save();
        })
        .then(result => {
            res.redirect('login');// /
            //re-enable before submitting
            //working but don't send lots right now
            return transporter.sendMail({
                to: email,
                from: 'str19023@byui.edu',
                subject: 'Signup succeeded',
                html: '<h1>You successfully signed up!</h1>'
            });
        })
        .catch(err => {
            //console.log(err);
            {
                const error = new Error(err);
                error.httpStatusCode = 500;
                return next(error);
            }
        })
};

exports.getReset = (req, res, next) => {
    console.log("inside getReset");
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    console.log("reset message", message);
    res.render('reset', {//auth
        path: '/reset',
        pageTitle: 'Reset Password',
        errorMessage: message
    });
}

exports.postReset = (req, res, next) => {
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err);
            return res.redirect('/reset');
        }
        const token = buffer.toString('hex');
        User.findOne({ email: req.body.email })
            .then(user => {
                if (!user) {
                    req.flash('error', 'No account with that email found.');
                    return res.redirect('/reset');
                }
                user.resetToken = token;
                user.resetTokenExpiration = Date.now() + 3600000;
                return user.save();
            })
            .then(result => {
                res.redirect('/');
                transporter.sendMail({
                    to: req.body.email,
                    from: 'str19023@byui.edu',
                    subject: 'Password Reset',
                    html: `<p>You requested a password reset</p>
            <p>Click this <a href=
            "http://localhost:5000/reset/${token}">link</a> to set a new password.</p>
            `
                });//*****!!!change address before heroku push */
                //"https://tictactoe-cse341.herokuapp.com/reset/${token}"//"http://localhost:5000/reset/${token}"
            })
            .catch(err => { //console.log(err); 
                const error = new Error(err);
                error.httpStatusCode = 500;
                return next(error);
            });
    });
}

exports.getNewPassword = (req, res, next) => {
    const token = req.params.token;
    User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
        .then(
            user => {
                let message = req.flash('error');
                if (message.length > 0) {
                    message = message[0];
                } else {
                    message = null;
                }
                res.render('newPass', {// auth/
                    path: '/newPass',
                    pageTitle: 'New Password',
                    errorMessage: message,
                    userId: user._id.toString(),
                    passwordToken: token
                });
            }
        )
        .catch(err => {
            //console.log(err);
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });


}

exports.postNewPassword = (req, res, next) => {
    const newPassword = req.body.password;
    const userId = req.body.userId;
    const passwordToken = req.body.passwordToken;
    let resetUser;

    User.findOne({
        resetToken: passwordToken,
        resetTokenExpiration: { $gt: Date.now() },
        _id: userId
    })
        .then(user => {
            resetUser = user;
            return bcrypt.hash(newPassword, 12);
        })
        .then(hashedPassword => {
            resetUser.password = hashedPassword;
            resetUser.resetToken = undefined;
            resetUser.resetTokenExpiration = undefined;
            return resetUser.save();

        }).then(result => {
            res.redirect('/login');
        })
        .catch(err => {
            //console.log(err);
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
}
