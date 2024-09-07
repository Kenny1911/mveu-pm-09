import React, {SetStateAction, useState} from 'react';
import {api} from "../service/services";
import {User} from "../service/models";
import Home from "./Home";

interface LoginArgs {
    setUser: React.Dispatch<SetStateAction<User|undefined>>
    setPage: React.Dispatch<SetStateAction<string>>
}

const Login = ({setUser, setPage}: LoginArgs) => {
    const [login, setLogin] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [error, setError] = useState<string|undefined>(undefined)

    const submit: React.FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault()

        try {
            const user = await api.login(login, password)
            setUser(user)
            setPage(Home.name)
            setError(undefined)
        } catch (err) {
            setError('Ошибка входа.')
        }
    }

    return (
        <>
            <h1>Вход</h1>

            {(() => {
                if (error) {
                    return (
                        <div>
                            {error}
                        </div>
                    )
                }
            })()}

            <form onSubmit={submit}>
                <div className="form-group">
                    <label htmlFor="">Логин:</label>
                    <input type="text" required value={login} onChange={(e) => setLogin(e.target.value)}/>
                </div>

                <div className="form-group">
                    <label htmlFor="">Пароль:</label>
                    <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}/>
                </div>

                <div className="form-group">
                    <input type="submit" value="Войти" />
                </div>
            </form>
        </>
    )
}

export default Login