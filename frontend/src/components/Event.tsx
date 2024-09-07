import React, {useState} from 'react';
import {User, Event as EventModel} from "../service/models";
import {api} from "../service/services";

interface EventArgs {
    user: User|undefined,
    event: EventModel,
}

const Event = ({user, event}: EventArgs) => {
    const [isRegistered, setRegistered] = useState<boolean>(false)

    const register = () => {
        try {
            api.registerEvent({
                title: event.title,
                timestamp: event.timestamp,
                userId: user?.id ?? ''
            })
            setRegistered(true)
        } catch (err) {
            alert('Ошибка!')
        }
    }

    return (
        <div className="event">
            <div>{event.title}</div>
            <div>{event.timestamp.toLocaleString()}</div>

            {(() => {
                if (user) {
                    if (isRegistered) {
                        return <div>Вы записаны</div>
                    } else {
                        return <div>
                            <button onClick={register}>Записаться</button>
                        </div>
                    }
                }

                return ''
            })()}
        </div>
    )
}

export default Event