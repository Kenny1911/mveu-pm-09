import React from 'react';
import img from "./../img/2.jpeg"

const Contacts = () => {
    return (
        <>
            <h1>Контакты</h1>

            <p>Московская область</p>
            <p>село Зеленое</p>
            <p>ул. Первомайская, 77</p>
            <p><a href="tel:79225250707">+7 922 525 07 07</a></p>

            <img src={img} alt=""/>
        </>
    )
}

export default Contacts