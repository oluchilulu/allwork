
require('dotenv').config()               //.
const mongoose = require('mongoose');      //.
console.log(process.env.DB)                //.

function connectDB(){
    try{
        console.log('connecting to db')      
        mongoose.connect(process.env.DB)      //.

        // mongoose.connect(dbLink,{
        //     useNewUrlParser:true,
        //     useUnifiedTopology:true,
        // })
        // mongoose.connect('mongodb://127.0.0.1:27017/db')
        console.log('connected')
    }catch (error) {
        console.log(error)
    }
}

module.exports = connectDB
