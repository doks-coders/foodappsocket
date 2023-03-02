const mongoose = require('mongoose');
const postSchema = mongoose.Schema({
    id:String,
    name:String,
    about:String,
    vehiclesUsed:Array,
    productType:Array,
    ingredients:Array,
    utensils:Array,
    link:String,
    image:String,
    coverimage:String,
    location:String,
    testimonials:Array,
   
    deal:Array,  
    created:{
        type:Date,
        default:Date.now,
    }
})


module.exports = mongoose.model('Procurers', postSchema)