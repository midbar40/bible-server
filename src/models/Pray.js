const mongoose = require('mongoose')

const { Schema } = mongoose
const { Types: { ObjectId }} = Schema


const praySchema = new Schema({
    author:{
        type: ObjectId,
        required: true,
        ref: 'User',
    },
    title:{
        type: String,
        required: true,
        trim: true,
    },
    description:{
        type: String,
        trim: true,
    },
    isDone:{
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
    finishedAt:{
        type: Date,
        default:Date.now,
    },

})

const Pray = mongoose.model('Pray', praySchema)
module.exports = Pray