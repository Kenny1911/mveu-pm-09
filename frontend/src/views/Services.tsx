import React from 'react';
import {api} from "../service/services";
import {User} from "../service/models";
import Service from "./../components/Service"

interface ServicesArgs {
    user: User|undefined
}

const Services = ({user}: ServicesArgs) => {
    const services = api.servicesList()

    return (
        <>
            <h1>Услуги</h1>

            {(() => {
                if (services.length > 0) {
                    return (
                        services.map((service, index) => {
                            return <Service key={index} user={user} service={service} />
                        })
                    )
                } else {
                    return <div>Услуг нет</div>
                }
            })()}

        </>
    )
}

export default Services