import React, {useState} from 'react';
import {api} from "../service/services";
import {Service as ServiceModel, User} from "../service/models";

interface ServiceArgs {
    user: User|undefined,
    service: ServiceModel
}

const Service = ({user, service}: ServiceArgs) => {
    const [registerDate, setRegisterDate] = useState<string>('')
    const [isRegistered, setRegistered] = useState<boolean>(false)

    const register = (): void => {
        try {
            api.registerService({
                title: service.title,
                price: service.price,
                timestamp: new Date(registerDate),
                userId: user?.id ?? ''
            })

            setRegistered(true)
        } catch (err) {
            alert('Ошибка')
        }
    }

    return (
        <div>
            <div>{service.title}</div>
            <div>{service.price} руб.</div>

            {(() => {
                if (user) {
                    if (isRegistered) {
                        return <div>Вы успешно зарегистрированы</div>
                    } else {
                        return <form onSubmit={register}>
                            <div>
                                <input
                                    type="datetime-local"
                                    required
                                    value={registerDate}
                                    onChange={(e) => setRegisterDate(e.target.value)}
                                />
                            </div>
                            <button>Записаться</button>
                        </form>
                    }
                }

                return ''
            })()}
        </div>
    )
}

export default Service