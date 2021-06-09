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
    country: {
        type: String,
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
    win: Boolean,

    draw: Boolean,
    one: {
        type: Number,
        default: null
    },
    two: {
        type: Number,
        default: null
    },
    three: {
        type: Number,
        default: null
    },
    four: {
        type: Number,
        default: null
    },
    five: {
        type: Number,
        default: null
    },
    six: {
        type: Number,
        default: null
    },
    seven: {
        type: Number,
        default: null
    },
    eight: {
        type: Number,
        default: null
    },
    nine: {
        type: Number,
        default: null
    },


});
module.exports = mongoose.model('GamePlay', userSchema);