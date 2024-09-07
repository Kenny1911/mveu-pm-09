import React, {SetStateAction, useState} from 'react';
import {api} from "../service/services";
import Home from "./Home";
import Login from "./Login";

interface RegisterArgs {
    setPage: React.Dispatch<SetStateAction<string>>
}

const Register = ({setPage}: RegisterArgs) => {
    const [login, setLogin] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [error, setError] = useState<string|undefined>(undefined)

    const submit: React.FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault()

        try {
            await api.register(login, password)
            setPage(Login.name)
            setError(undefined)
        } catch (err: any) {
            setError(err.toString())
        }
    }

    return (
        <>
            <h1>Регистрация</h1>

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
                <div>
                    <label htmlFor="">Логин:</label>
                    <input type="text" required value={login} onChange={(e) => setLogin(e.target.value)}/>
                </div>

                <div>
                    <label htmlFor="">Пароль:</label>
                    <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}/>
                </div>

                <div>
                    <input type="submit" value="Войти" />
                </div>
            </form>
        </>
    )
}

export default Register