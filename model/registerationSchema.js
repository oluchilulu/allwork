const mongoose = require("mongoose")
const {Schema} = mongoose
// To connect to database, 

// const users = new Schema({
//     username: String,
//     password: String, 
//     role: String,
//     active: Boolean
// }) // without validation

// Backend Schema Validat
const users = new Schema({
        username:{
        type:  String,
        require: true, 
        // minLength:[10,'Username must be above 10'],
        unique:true,
        trim:true,
        },

       fullname:{
        type: String,
        requiretrue:true,
        // minlenght:[10, 'fullname must be above 10'],
        trim:true,
       },

       passport:{
        type: String,
        require:true,
        trim:true,
       },


 phone:{
        type: String,
        require:true,
        trim:true,
       },

//kelvin powell
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

module.exports = mongoose.model('User', users);


