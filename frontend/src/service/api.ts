import {User, Event, EventRegistration, Service, ServiceRegistration} from "./models";

export default interface Api {
    getLoggedUser(): User|undefined

    login(login: string, password: string): Promise<User>

    logout(): void

    register(login: string, password: string): Promise<User>

    eventsList(): Array<Event>

    registerEvent(event: EventRegistration): void

    listRegisteredEvents(): Promise<Array<EventRegistration>>

    servicesList(): Array<Service>

    registerService(service: ServiceRegistration): void

    listRegisteredServices(): Promise<Array<ServiceRegistration>>
}

export class StorageApi implements Api {
    private storage: Storage
    private readonly events: Array<Event>
    private readonly services: Array<Service>

    private loggedUser?: User = undefined
    private users: Array<User&{password: string}> = []

    private registeredEvents: Array<EventRegistration> = []
    private registeredServices: Array<ServiceRegistration> = []

    constructor(storage: Storage, events: Array<Event>, services: Array<Service>) {
        this.storage = storage;
        this.load()
        this.events = events
        this.services = services
    }

    getLoggedUser(): User | undefined {
        return this.loggedUser;
    }

    async login(login: string, password: string): Promise<User> {
        for (const user of this.users) {
            if (user.login === login && user.password === password) {
                this.loggedUser = user
                this.commit()
                return user;
            }
        }

        throw new Error('Неверные логин или пароль')
    }

    logout() {
        this.loggedUser = undefined
        this.commit()
    }

    async register(login: string, password: string): Promise<User> {
        for (const user of this.users) {
            if (user.login === login) {
                throw new Error('такой пользователь уже существует')
            }
        }
        const user = {
            id: new Date().getTime().toString(),
            login: login,
            password: password,
        }
        this.users.push(user)
        this.commit()

        return user
    }

    eventsList(): Array<Event> {
        return this.events
    }

    async listRegisteredEvents(): Promise<Array<EventRegistration>> {
        return this.registeredEvents.filter((event) => event.userId === this.loggedUser?.id)
    }

    registerEvent(event: EventRegistration): void {
        this.registeredEvents.push(event)
        this.commit()
    }

    servicesList(): Array<Service> {
        return this.services
    }

    async listRegisteredServices(): Promise<Array<ServiceRegistration>> {
        return this.registeredServices.filter((service) => service.userId === this.loggedUser?.id)
    }

    registerService(service: ServiceRegistration): void {
        this.registeredServices.push(service)
        this.commit()
    }

    private load = () => {
        this.users = JSON.parse(this.storage.getItem('users') ?? '[]') as Array<User&{password: string}>

        const loggedUserId = this.storage.getItem('loggedUserId')

        if (loggedUserId) {
            for (const user of this.users) {
                if (user.id === loggedUserId) {
                    this.loggedUser = user
                }
            }
        }

        const timestampReviver = (key: string, value: any) => {
            if ('timestamp' === key) {
                return new Date(value)
            }

            return value
        }

        this.registeredEvents = JSON.parse(this.storage.getItem('registeredEvents') ?? '[]', timestampReviver) as Array<EventRegistration>
        this.registeredServices = JSON.parse(this.storage.getItem('registeredServices') ?? '[]', timestampReviver) as Array<ServiceRegistration>
    }

    private commit = () => {
        this.storage.setItem('users', JSON.stringify(this.users))

        if (this.loggedUser) {
            this.storage.setItem('loggedUserId', this.loggedUser?.id)
        } else {
            this.storage.removeItem('loggedUserId')
        }

        this.storage.setItem('registeredEvents', JSON.stringify(this.registeredEvents))
        this.storage.setItem('registeredServices', JSON.stringify(this.registeredServices))
    }
}

export class RestApi implements Api {
    private url: string
    private storage: Storage
    private token?: string
    private readonly events: Array<Event>
    private readonly services: Array<Service>

    private loggedUser?: User = undefined


    constructor(url: string, storage: Storage, events: Array<Event>, services: Array<Service>) {
        this.url = url
        this.storage = storage;
        this.events = events;
        this.services = services;

        this.token = this.storage.getItem('token') ?? undefined

        const loggedUserJson = this.storage.getItem('loggedUser')

        if (loggedUserJson) {
            this.loggedUser = JSON.parse(loggedUserJson)
        }
    }

    getLoggedUser(): User|undefined
    {
        return this.loggedUser
    }

    async login(login: string, password: string): Promise<User>
    {
        const response =  await this.request<{token: string, user: User}>('/login', 'POST', {login, password})

        this.token = response.token
        this.storage.setItem('token', this.token)
        this.loggedUser = response.user
        this.storage.setItem('loggedUser', JSON.stringify(this.loggedUser))

        return this.loggedUser
    }

    logout(): void
    {
        this.token = undefined
        this.loggedUser = undefined
        this.storage.removeItem('token')
        this.storage.removeItem('loggedUser')
    }

    async register(login: string, password: string): Promise<User>
    {
        const response = await this.request<{user: User}>('/registration', 'POST', {login, password})

        return response.user
    }

    eventsList(): Array<Event>
    {
        return this.events
    }

    registerEvent(event: EventRegistration): void
    {
        this.request('/events/registered', 'POST', {title: event.title, timestamp: event.timestamp.toISOString()})
    }

    async listRegisteredEvents(): Promise<Array<EventRegistration>>
    {
        return await this.request<Array<EventRegistration>>('/events/registered', 'GET')
    }

    servicesList(): Array<Service>
    {
        return this.services
    }

    registerService(service: ServiceRegistration): void
    {
        this.request('/services/registered', 'POST', {title: service.title, price: service.price, timestamp: service.timestamp.toISOString()})
    }

    async listRegisteredServices(): Promise<Array<ServiceRegistration>>
    {
        return await this.request<Array<ServiceRegistration>>('/services/registered', 'GET')
    }

    private async request<T = any>(path: string, method: string = 'GET', data: any = undefined): Promise<T> {
        const headers: {[key: string]: string} = {
            'Content-Type': 'application/json',
        }

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`
        }

        const requestInit: RequestInit = { method, headers }

        if ('HEAD' !== method && 'GET' !== method && undefined !== data) {
            requestInit.body = JSON.stringify(data)
        }

        //console.log({ url: this.url + path, ...requestInit })

        return fetch(this.url + path, requestInit)
            .then(async r => {
                if (r.status >= 400 && r.status < 600) {
                    throw new Error("Bad response from server");
                }

                const t = await r.text()

                return JSON.parse(t, (key: string, value: any) => {
                    if ('timestamp' === key) {
                        return new Date(value)
                    }

                    return value
                })
            })
    }
}
