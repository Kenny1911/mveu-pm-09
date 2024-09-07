const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const Authentication = require('./authentication')
const dto = require('./dto')
const {User, ROLE_CUSTOMER, ROLE_ADMIN} = require('./models/User')
const {RegisteredEvent} = require("./models/RegisteredEvent");
const {RegisteredService} = require("./models/RegisteredService");

// Middleware for check authorization
const grantAccess = (auth, role = null) => {
    return async (req, res, next) => {
        const user = await auth.getUser(req);

        if (!user || (role && user.role !== role)) {
            return res.status(400).json({message: 'Доступ запрещен'})
        }
    
        next();
    }
}

// Function for run server
module.exports = (settings) => {
    // Init settings
    const APP_HOST = settings.APP_HOST || '127.0.0.1';
    const APP_PORT = settings.APP_PORT || 9000;
    const MONGO_URL = settings.MONGO_URL || 'mongodb://root:toor@127.0.0.1:27017';
    const JWT_SECRET = settings.JWT_SECRET || 'mveu';
    const JWT_EXPIRES = settings.JWT_EXPIRES || '24h';

    const auth = new Authentication(JWT_SECRET, JWT_EXPIRES)

    const app = express()

    app.use(cors())
    app.use(express.json())

    app.post('/registration', async (req, res) => {
        const { login, password } = req.body
        
        if (await User.countDocuments({login: login}) > 0) {
            return res.status(409).json({message: 'Пользователь с таким логином уже существует!'})
        }

        const user = new User({login, password})
        await user.save()
        
        return res.json({
            message: 'Вы успешно зарегистрировались!',
            user: dto.userToDto(user),
        })
    })

    app.post('/login', async (req, res) => {
        const {login, password} = req.body
        const user = await User.findOne({login})

        if (!(user && user.password === password)) {
            return res.status(400).json({message: 'Неверный логин или пароль!'})
        }

        return res.json({
            message: 'Вы успешно авторизованы!',
            token: auth.generateAccessToken(user),
            user: dto.userToDto(user),
        })
    })

    app.get('/events/registered', grantAccess(auth), async (req, res) => {
        const user = await auth.getUser(req)

        const registeredEvents = await RegisteredEvent.find({userId: user._id}).exec()

        return res.json(registeredEvents.map(dto.registeredEventToDto))
    })

    app.post('/events/registered', grantAccess(auth), async (req, res) => {
        const user = await auth.getUser(req)
        const {title, timestamp} = req.body

        const registeredEvent = new RegisteredEvent({userId: user._id, title, timestamp: new Date(timestamp)})
        await registeredEvent.save()

        return res.json(dto.registeredEventToDto(registeredEvent))
    })

    app.get('/services/registered', grantAccess(auth), async (req, res) => {
        const user = await auth.getUser(req)

        const registeredServices = await RegisteredService.find({userId: user._id}).exec()

        return res.json(registeredServices.map(dto.registeredServiceToDto))
    })

    app.post('/services/registered', grantAccess(auth), async (req, res) => {
        const user = await auth.getUser(req)
        const {title, timestamp, price} = req.body

        const registeredService = new RegisteredService({userId: user._id, title, timestamp: new Date(timestamp), price})
        await registeredService.save()

        return res.json(dto.registeredServiceToDto(registeredService))
    })

    // Async function to start server
    const start = async () => {
        try {
            console.log('Start server')

            console.log('Try connect to Mongo')
            await mongoose.connect(MONGO_URL, {authSource: "admin"})
            console.log('Connected')

            app.listen(APP_PORT, APP_HOST, () => console.log(`Server listen ${APP_HOST}:${APP_PORT}`))
        } catch (e) {
            console.log(e)
        }
    }

    start()
}
