import React, {useState, useEffect} from 'react';
import {api} from "../../service/services";
import {ServiceRegistration} from "../../service/models";

const RegisteredServicesList = () => {
    const [services, setServices] = useState<Array<ServiceRegistration>>([])

    useEffect(() => {
        api.listRegisteredServices().then((s) => setServices(s))
    }, []);

    return (
        <>
            <h1>Записи на услуги</h1>

            {(() => {
                if (services.length > 0) {
                    return (services.map((service, index) => (
                        <div key={index}>
                            <div>{service.title}</div>
                            <div>{service.price} руб.</div>
                            <div>{service.timestamp.toLocaleString()}</div>
                        </div>
                    )))
                } else {
                    return <div>Записей нет</div>
                }
            })()}
        </>
    )
}

export default RegisteredServicesList