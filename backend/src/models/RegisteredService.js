const { Schema, model } = require('mongoose')

const RegisteredService = new Schema({
    title: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    timestamp: {
        type: Schema.Types.Date,
    },
    userId: {
        type: String,
        required: true,
    }
})

module.exports = {
    RegisteredService: model('RegisteredService', RegisteredService),
}
