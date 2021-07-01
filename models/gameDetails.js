//id, name, email, country, wins, losses, draws, totalGamesPlayed  
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const gameJsonSchema = new Schema({

    gameJson: {
        type: String,
        required: true
    },


});
userSchema.methods.totalGamesPlayed = function()  {
//calculate total from wins, losses, and draws
}
module.exports = mongoose.model('User', userSchema);