export interface User {
    id: string
    login: string
}

export interface Event {
    title: string
    timestamp: Date
}

export interface EventRegistration {
    title: string
    timestamp: Date
    userId: string
}

export interface Service {
    title: string
    price: number
}

export interface ServiceRegistration {
    title: string
    datetime: Date
    price: number
    userId: string
}

