const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    mobileNo:{
        type:Number,
        required:true,
        unique:true,
        minlength:10,
        maxlength:10
    },
    
    email:{     
    type:String,
    required:true,
    unique:true,
    match:/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

    },
    password:{
        type:String,
        required:true,
        minlength:6
    }
},{
    timestamps:true 
})
module.exports = mongoose.model('User',userSchema);