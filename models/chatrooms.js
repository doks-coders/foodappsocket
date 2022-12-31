const mongoose = require('mongoose');
const postSchema = mongoose.Schema({
    userId:String,
    procurerId:String,
    roomId:String,
    messages:Array,
    created:{
        type:Date,
        default:Date.now,
    }
})


module.exports = mongoose.model('Chatrooms', postSchema)