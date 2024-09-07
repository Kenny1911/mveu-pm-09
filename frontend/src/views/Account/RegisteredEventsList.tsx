import React, {useState, useEffect} from 'react';
import {api} from "../../service/services";
import {EventRegistration} from "../../service/models";

const RegisteredEventsList = () => {
    const [events, setEvents] = useState<Array<EventRegistration>>([])

    useEffect(() => {
        api.listRegisteredEvents().then((e) => setEvents(e))
    }, [])

    return (
        <>
            <h1>Записи на мероприятия</h1>

            {(() => {
                if (events.length > 0) {
                    return events.map((event, index) => (
                        <div key={index}>
                            <div>{event.title}</div>
                            <div>{event.timestamp.toLocaleString()}</div>
                        </div>
                    ))
                } else {
                    return <div>Записей нет</div>
                }
            })()}
        </>
    )
}

export default RegisteredEventsList