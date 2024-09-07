import React from 'react';
import {User} from "../service/models";
import {api} from "../service/services";
import Event from "../components/Event";

interface EventsArgs {
    user: User|undefined
}

const Events = ({user}: EventsArgs) => {
    const events = api.eventsList()

    return (
        <>
            <h1>Мероприятия</h1>

            {(() => {
                if (events.length > 0) {
                    return (
                        events.map((event, index) => {
                            return (
                                <Event key={index} user={user} event={event}/>
                            )
                        })
                    )
                } else {
                    return <div>Мероприятий нет</div>
                }
            })()}
        </>
    )
}

export default Events