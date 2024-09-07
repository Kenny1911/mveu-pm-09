import React, { useState, useEffect } from 'react';
import './App.css';
import {User} from "./service/models";
import {api} from "./service/services";
import Header from "./components/Header";
import Footer from "./components/Footer";
import NotFound from "./views/NotFound";
import Home from "./views/Home";
import Contacts from "./views/Contacts";
import About from "./views/About";
import Login from "./views/Login";
import Register from "./views/Register";
import Events from "./views/Events";
import RegisteredEventsList from "./views/Account/RegisteredEventsList";
import Services from "./views/Services";
import RegisteredServicesList from "./views/Account/RegisteredServicesList";

const App = () => {
    const [page, setPage] = useState<string>(Home.name)
    const [user, setUser] = useState<User|undefined>(api.getLoggedUser())

    //window.setPage = setPage

    const showPage = (): React.JSX.Element => {
        switch (page) {
            case Home.name: return <Home />
            case Contacts.name: return <Contacts />
            case About.name: return <About />
            case Login.name: return <Login setUser={setUser} setPage={setPage} />
            case Register.name: return <Register setPage={setPage} />
            case Events.name: return <Events user={user} />
            case RegisteredEventsList.name: return <RegisteredEventsList />
            case Services.name: return <Services user={user} />
            case RegisteredServicesList.name: return <RegisteredServicesList />
            default: return <NotFound/>

        }
    }

    return (
        <>
            <Header setPage={setPage} setUser={setUser} isLogged={!!user} />
            <main>
                <div className="container">
                    {showPage()}
                </div>
            </main>
            <Footer/>
        </>
    );
}

export default App;
