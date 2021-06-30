//- id, activePlayer= userModelId, player1=UserModel, player2=UserModel, win, loss, draw, 1=null, 2=null, 3=null, 4=null, 5=null, 6=null, 7=null, 8=null, 9=null
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gameSchema = new Schema({
    play: {
        type: Boolean,
        required: true,
    },
    player1Turn: {
        type: Boolean,
        required: true
    },
    player1: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    player2: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    player1Country: {
        type: String,
        required: true
    },
    player2Country: {
        type: String,
        required: true
    },
    clickCount: String,
    gameWinner: String, // Options: player1, player2, tie
    gameGrid: { 
        type: String,
        required: false
    }
});

// gameSchema.methods.saveGame = function () {
//     const updateGames = [...this];
//     console.log('Games Available');
//     console.log(this);
// }

// gameSchema.methods.chooseSpace = function () {
//     //Loop through gameGrid spaces and assign player to chosen space
// }
// gameSchema.methods.determineState = function () {
//     //check for wins
//     //loop through gameGrid and determine if all spaces are filled for draw
// }
// gameSchema.methods.drawBoard = function () {

// }

module.exports = mongoose.model('GamePlay', gameSchema);







// spaces: [{
        //     one: {
        //         type: Schema.Types.ObjectId,
        //         ref: 'User',
        //         default: null
        //     },
        //     two: {
        //         type: Schema.Types.ObjectId,
        //         ref: 'User',
        //         default: null
        //     },
        //     three: {
        //         type: Schema.Types.ObjectId,
        //         ref: 'User',
        //         default: null
        //     },
        //     four: {
        //         type: Schema.Types.ObjectId,
        //         ref: 'User',
        //         default: null
        //     },
        //     five: {
        //         type: Schema.Types.ObjectId,
        //         ref: 'User',
        //         default: null
        //     },
        //     six: {
        //         type: Schema.Types.ObjectId,
        //         ref: 'User',
        //         default: null
        //     },
        //     seven: {
        //         type: Schema.Types.ObjectId,
        //         ref: 'User',
        //         default: null
        //     },
        //     eight: {
        //         type: Schema.Types.ObjectId,
        //         ref: 'User',
        //         default: null
        //     },
        //     nine: {
        //         type: Schema.Types.ObjectId,
        //         ref: 'User',
        //         default: null
        //     }
        // }
        // ]