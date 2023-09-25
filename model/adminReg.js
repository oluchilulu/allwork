const mongoose = require("mongoose")
const {Schema} = mongoose

const users = new Schema({
        username:{
        type:  String,
        require: true, 
        
        unique:true,
        trim:true,
        },

        password:{
        type:  String,
        require: true, 
       
        trim:true,
        },

        role:{
        type:  String,
        require: true, 
        },

        active:{
        type:  Boolean,
        require: true, 
        },

    })

module.exports = mongoose.model('Admin', users);

