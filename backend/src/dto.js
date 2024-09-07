const User = require('./models/User').User

const userToDto = (user) => {
    return {
        id: user._id,
        login: user.login,
    }
}

const registeredServiceToDto = (registeredService) => {
    return {
        id: registeredService._id,
        title: registeredService.title,
        price: registeredService.price,
        timestamp: registeredService.timestamp,
        userId: registeredService.userId
    }
}

const registeredEventToDto = (registeredEvent) => {
    return {
        id: registeredEvent._id,
        title: registeredEvent.title,
        timestamp: registeredEvent.timestamp,
        userId: registeredEvent.userId
    }
}

module.exports = {
    userToDto,
    registeredServiceToDto,
    registeredEventToDto,
}