const { Schema, model } = require('mongoose')

const RegisteredEvent = new Schema({
    title: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Schema.Types.Date,
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
    }
})

module.exports = {
    RegisteredEvent: model('RegisteredEvent', RegisteredEvent),
}
