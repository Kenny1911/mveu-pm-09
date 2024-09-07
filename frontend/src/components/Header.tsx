import React, {SetStateAction} from 'react';
import Home from "./../views/Home";
import Contacts from "./../views/Contacts";
import About from "./../views/About";
import Login from "./../views/Login";
import Register from "./../views/Register";
import Events from "./../views/Events";
import RegisteredEventsList from "./../views/Account/RegisteredEventsList";
import Services from "./../views/Services";
import RegisteredServicesList from "./../views/Account/RegisteredServicesList";
import {User} from "../service/models";
import {api} from "../service/services";

interface HeaderArgs {
    setPage: React.Dispatch<SetStateAction<string>>,
    setUser: React.Dispatch<SetStateAction<User|undefined>>,
    isLogged: boolean
}

const Header = ({setPage, setUser, isLogged}: HeaderArgs) => {
    return (
        <>
            <header>
                <div className="container">
                    <ul>
                        <li onClick={() => setPage(Home.name)}>Главная</li>
                        <li onClick={() => setPage(Services.name)}>Услуги</li>
                        <li onClick={() => setPage(Events.name)}>Мероприятия</li>
                        <li onClick={() => setPage(About.name)}>О клубе</li>
                        <li onClick={() => setPage(Contacts.name)}>Контакты</li>
                        {(() => {
                            if (isLogged) {
                                return (
                                    <>
                                        <li onClick={() => setPage(RegisteredServicesList.name)}>Записи на услуги</li>
                                        <li onClick={() => setPage(RegisteredEventsList.name)}>Записи на мероприятия</li>
                                        <li onClick={() => {api.logout(); setUser(undefined) }}>Выйти</li>
                                    </>
                                )
                            } else {
                                return (
                                    <>
                                        <li onClick={() => setPage(Login.name)}>Вход</li>
                                        <li onClick={() => setPage(Register.name)}>Регистрация</li>
                                    </>
                                )
                            }
                        })()}
                    </ul>
                </div>
            </header>
        </>
    )
}

export default Header