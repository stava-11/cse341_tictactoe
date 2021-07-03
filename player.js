const User = require('../models/user');
const GamePlay = require('../models/gamePlay');

exports.getProfile = (req, res, next) => {
    res.render('editUserProfile', {
        pageTitle: 'Edit Profile',
        path: '/editUserProfile'
    });
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
            const games = GamePlay.find({$or:[ 
                {player1: req.session.user},
                {player2: req.session.user}
            ]
            });
            return games
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

exports.getPlayGame = (req, res, next) => {
    const gameDetails = {
        _id: req.body.gamePlay_id,
        play: req.body.play,
        player1Turn: req.body.player1Turn,
        player1: req.body.player1,
        player2: req.body.player2,
        // player1Country: req.body.player1Country,
        // player2Country: req.body.player2Country,
        clickCount: req.body.clickCount,
        gameWinner: req.body.gameWinner,
        gameGrid: req.body.gameGrid
    };
    console.log('click count');
    console.log(gameDetails.clickCount);
    if (gameDetails.play === 'false'){
        gameDetails.play = false;
    } else if (gameDetails.play === 'true'){
        gameDetails.play = true;
    }

    if (gameDetails.player1Turn === 'false'){
        gameDetails.player1Turn = false;
    } else if (gameDetails.player1Turn === 'true'){

        gameDetails.player1Turn = true;
    }

    GamePlay.findById(
        gameDetails._id,
        function(err, result){
            if(err){
                res.send(err) 

            } else {
                return result
            }
        }
    ).then(result => {
        if (result.gameGrid){
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
    console.log('HIT ME THRICE!!!')
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
        {_id: gameDetails._id},
        {play: gameDetails.play,
        player1Turn: gameDetails.player1Turn,
        clickCount: gameDetails.clickCount,
        gameWinner: gameDetails.gameWinner,
        gameGrid: gameDetails.gameGrid},
        {new: true},
        function(err, result){
            if(err){
                res.send(err) 

            } else {
                return result
            }
        }
    ).then(result => {
        console.log('move result');
        console.log(result);
        if (result){
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
        res.render('playGame', { 
            user: req.session.user,
            gameDetails: gameDetails,
            pageTitle: 'Play Game', 
            path: '/playGame' 
        });
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
            const games = GamePlay.find({$or:[ 
                {player1: req.session.user},
                {player2: req.session.user}
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

        //////////////////////////////////////////////
        // Need to add in the weather information here
        //////////////////////////////////////////////
}

