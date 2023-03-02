const mongoose = require('mongoose');
const postSchema = mongoose.Schema({
    name:String,
    email:String,
    coverimage:String,
    image:String,
    favouriteItems:Object,
    chatRooms:Array,cartItems1:Array,
    cartItems:Array,
    notifications:Array,
    orderInformation:Array,
    coordinates:Array,
    location:Array,

    created:{
        type:Date,
        default:Date.now,
    }
})


module.exports = mongoose.model('Users', postSchema)