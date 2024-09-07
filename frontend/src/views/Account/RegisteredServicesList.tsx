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
                        <div key={index} className="registered-service">
                            <div><b>{service.title}</b></div>
                            <div>{service.price} руб.</div>
                            <div><i>{service.timestamp.toLocaleString()}</i></div>
                        </div>
                    )))
                } else {
                    return <h4>Записей нет</h4>
                }
            })()}
        </>
    )
}

export default RegisteredServicesList