const mongoose = require('mongoose')

const { Schema } = mongoose
const { Types: { ObjectId }} = Schema

const userSchema = new Schema({
    name:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: true,
    },
    isAdmin:{
        type: Boolean,
        default:false,
    }, 
    createdAt:{
        type: Date,
        default:Date.now,
    },
    lastModifiedAt:{
        type: Date,
        default:Date.now,
    },
<<<<<<< HEAD
=======
    prayBucketlist:[{
        type: ObjectId,
        ref: 'PrayBucketlist',
    }]
>>>>>>> e6aff330a7bccc697c90edc4797c51fb43e259ab
})

const User = mongoose.model('User', userSchema, 'users')
module.exports = User