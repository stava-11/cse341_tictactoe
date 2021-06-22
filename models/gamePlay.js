//- id, activePlayer= userModelId, player1=UserModel, player2=UserModel, win, loss, draw, 1=null, 2=null, 3=null, 4=null, 5=null, 6=null, 7=null, 8=null, 9=null
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({

    activePlayer: {
        type: Schema.Types.ObjectId,
        ref: 'User',
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
    
    winPlayer: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        //required: true
    },
    losePlayer: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        //required: true
    },
    accepted: Boolean,
    play: Boolean,
    win: Boolean,
    draw: Boolean,
    gameGrid: { }
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
   //}


});
userSchema.methods.chooseSpace = function () {
    //Loop through gameGrid spaces and assign player to chosen space
}
userSchema.methods.determineState = function () {
    //check for wins
    //loop through gameGrid and determine if all spaces are filled for draw
}
userSchema.methods.drawBoard = function () {

}
module.exports = mongoose.model('GamePlay', userSchema);