const mongoose = require('mongoose')

const IdeasSchema = new mongoose.Schema({
    titles: {
        type: String,
        required: true
    },
    details: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})

mongoose.model('ideas', IdeasSchema)