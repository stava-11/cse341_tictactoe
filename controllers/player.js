const User = require('../models/user');
const GamePlay = require('../models/gamePlay');
const { validationResult } = require('express-validator');

exports.getProfile = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('editUserProfile', {
        pageTitle: 'Edit Profile',
        path: '/editUserProfile',
        errorMessage: message,
        oldInput: {
            name: '',
        },
        validationErrors: []
    });
};
exports.postUpdateProfile = (req, res, next) => {
    const name = req.body.name;
    // const userId = req.body._id;
    const userId = req.session.user._id;
    console.log("id", userId);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array());
        return res.status(422).render('editUserProfile', {
            pageTitle: 'Edit Profile',
            path: '/editUserProfile',
            errorMessage: errors.array()[0].msg,
            oldInput: {
                name: name,
            },
            validationErrors: errors.array()
        });
    }
    // User.findById(userId)
    //     .then(user => {
    //         user.name = name;
    //         console.log("inside FindById", name);
    //         return user.save();
    //     })
    User.findByIdAndUpdate(userId, { name: name }, { new: true })

        .then(result => {
            // console.log("inside find", req.session.user);
            // console.log("result", result)
            req.session.user.name = result.name
            res.redirect('/dashboard');
        })
        .catch(err => {
            {
                const error = new Error(err);
                error.httpStatusCode = 500;
                return next(error);
            }
        })

};

exports.getDashboard = (req, res, next) => {
    //const gameDetails = {};
    User.find()
        .then(players => {
            req.session.players = players;
            req.session.save();
            return players;
        }).then(players => {
            console.log(req.session.user);
            const games = GamePlay.find({
                $or: [
                    { player1: req.session.user },
                    { player2: req.session.user }
                ]
            });
            return games;
        }).then(games => {
            console.log(games);
            res.render('dashboard', {
                games: games,
                players: req.session.players,
                weather: req.session.weather,
                user: req.session.user,
                pageTitle: 'Dashboard',
                path: '/dashboard'
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
    //////////////////////////////////////////////
    // Need to add in the weather information here
    //////////////////////////////////////////////
};
// exports.postDashboard = (req, res, next) => {
//     //const gameDetails = {};
//     console.log('player/postDashboard:');
//     const location = {
//         location: req.body
//     };

//     console.log('player/postDashboard:', location);
//     User.find()
//         .then(players => {
//             req.session.players = players;
//             req.session.save();
//             return players;  
//         }).then(players => {
//             const games = GamePlay.find({$or:[ 
//                 {player1: req.session.user},
//                 {player2: req.session.user}
//             ]
//             });
//             return games;
//         }).then(games => {
//             res.render('dashboard', { 
//                 games: games,
//                 players: req.session.players,
//                 user: req.session.user,
//                 pageTitle: 'Dashboard', 
//                 path: '/dashboard' 
//             }); 
//         })
//         .catch(err => {
//             const error = new Error(err);
//             error.httpStatusCode = 500;
//             return next(error);
//           });


//         //////////////////////////////////////////////
//         // Need to add in the weather information here
//         //////////////////////////////////////////////
// };


// exports.postDashboard = (req, res, next) => {
//     //const gameDetails = {};
//     console.log('player/postDashboard:');
//     const location = {
//         location: req.body
//     };

//     console.log('player/postDashboard:', location);
//     User.find()
//         .then(players => {
//             req.session.players = players;
//             req.session.save();
//             return players;  
//         }).then(players => {
//             const games = GamePlay.find({$or:[ 
//                 {player1: req.session.user},
//                 {player2: req.session.user}
//             ]
//             });
//             return games;
//         }).then(games => {
//             res.render('dashboard', { 
//                 games: games,
//                 players: req.session.players,
//                 user: req.session.user,
//                 pageTitle: 'Dashboard', 
//                 path: '/dashboard' 
//             }); 
//         })
//         .catch(err => {
//             const error = new Error(err);
//             error.httpStatusCode = 500;
//             return next(error);
//           });


//         //////////////////////////////////////////////
//         // Need to add in the weather information here
//         //////////////////////////////////////////////
// };

exports.getPlayGame = (req, res, next) => {
    const gameDetails = {
        _id: req.body.gamePlay_id,
        play: req.body.play,
        player1Turn: req.body.player1Turn,
        player1: req.body.player1,
        player2: req.body.player2,
        //player1Country: req.body.player1Country,
        //player2Country: req.body.player2Country,
        clickCount: req.body.clickCount,
        gameWinner: req.body.gameWinner,
        gameGrid: req.body.gameGrid
    };
    console.log('click count');
    console.log(gameDetails.clickCount);
    if (gameDetails.play === 'false') {
        gameDetails.play = false;
    } else if (gameDetails.play === 'true') {
        gameDetails.play = true;
    }

    if (gameDetails.player1Turn === 'false') {
        gameDetails.player1Turn = false;
    } else if (gameDetails.player1Turn === 'true') {

        gameDetails.player1Turn = true;
    }

    GamePlay.findById(
        gameDetails._id,
        function (err, result) {
            if (err) {
                res.send(err)

            } else {
                return result
            }
        }
    ).then(result => {
        if (result.gameGrid) {
            gameDetails.gameGrid = JSON.parse(result.gameGrid);
            console.log(gameDetails);
        }
        res.render('playGame', {
            user: req.session.user,
            gameDetails: gameDetails,
            pageTitle: 'Play Game',
            path: '/playGame'
        });
    })
};

exports.postPlayerMove = (req, res, next) => {
    const gameDetails = {
        _id: req.body._id,
        play: req.body.play,
        player1Turn: req.body.player1Turn,
        player1: req.body.player1,
        player2: req.body.player2,
        clickCount: req.body.clickCount,
        gameWinner: req.body.gameWinner,
        gameGrid: req.body.gameGrid
    };
    console.log(typeof gameDetails.clickCount);

    console.log(gameDetails.clickCount);

    GamePlay.findByIdAndUpdate(
        { _id: gameDetails._id },
        {
            play: gameDetails.play,
            player1Turn: gameDetails.player1Turn,
            clickCount: gameDetails.clickCount,
            gameWinner: gameDetails.gameWinner,
            gameGrid: gameDetails.gameGrid
        },
        { new: true },
        function (err, result) {
            if (err) {
                res.send(err)

            } else {
                return result
            }
        }
    ).then(result => {
        console.log('move result');
        console.log(result);
        if (result) {
            gameDetails.gameGrid = JSON.parse(result.gameGrid);
        } else {
            gameDetails.gameGrid = {
                "1": "",
                "2": "",
                "3": "",
                "4": "",
                "5": "",
                "6": "",
                "7": "",
                "8": "",
                "9": ""
            };
        }
        // res.render('playGame', {
        //     user: req.session.user,
        //     gameDetails: gameDetails,
        //     pageTitle: 'Play Game',
        //     path: '/playGame'
        // });
        res.redirect('dashboard');
    })

}


exports.postGamePlay = (req, res, next) => {

    const gamePlay = new GamePlay({
        play: req.body.play,
        player1Turn: req.body.player1Turn,
        player1: req.body.player1,
        player2: req.body.player2,
        clickCount: req.body.clickCount,
        gameWinner: req.body.gameWinner,
        gameGrid: req.body.gameGrid
    });
    console.log('player.js/postGamePlay:', gamePlay);
    gamePlay.save()
        .then(result => {
            console.log('Created New Game');
            return result;
        }).then(result => {
            const games = GamePlay.find({
                $or: [
                    { player1: req.session.user },
                    { player2: req.session.user }
                ]
            });
            return games;
        }).then(games => {
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
}

