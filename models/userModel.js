const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
        
    },
    role:{
        type:String,
        default: "user"
    },
        cart:{
        type:Array,
        default: []
    },
},{
    timestamps: true
})

module.exports = mongoose.model('Users', userSchema)