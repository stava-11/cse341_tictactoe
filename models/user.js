//id, name, email, country, wins, losses, draws, totalGamesPlayed  
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({

    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    currentGames: {
        games: [
            {
                gameId: {
                    type: Schema.Types.ObjectId,
                    ref: 'GamePlay'
                },
            }
        ]

    },
    wins: Number,
    losses: Number,
    draws: Number,
    totalGamesPlayed: Number, //need or calculate from wins/losses/draws?
    resetToken: String,
    resetTokenExpiration: Date,


});
module.exports = mongoose.model('User', userSchema);