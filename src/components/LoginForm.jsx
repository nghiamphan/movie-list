import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Button, Container, TextField } from '@mui/material'

import loginService from '../services/login'
import userService from '../services/users'
import { login } from '../reducers/userReducer'

const Form = ({
    username,
    setUsername,
    password,
    setPassword,
    error,
    errorMessage,
    onSubmit,
    buttonText,
}) => (
    <Container sx={{ marginTop: 16 }}>
        <form onSubmit={onSubmit}>
            <TextField
                sx={{ marginTop: 2 }}
                label="Username"
                value={username}
                error={error.username}
                onChange={({ target }) => setUsername(target.value)}
            />
            <br />
            <TextField
                sx={{ marginTop: 2 }}
                label="Password"
                type="password"
                value={password}
                error={error.password}
                onChange={({ target }) => setPassword(target.value)}
            />
            <br />
            {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
            <Button sx={{ marginTop: 2 }} type="submit" variant="contained">
                {buttonText}
            </Button>
        </form>
    </Container>
)

const LoginForm = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState({
        username: false,
        password: false,
    })
    const [errorMessage, setErrorMessage] = useState(null)

    const handLogin = async (event) => {
        event.preventDefault()
        if (!username || !password) {
            if (!username) {
                setError({ ...error, username: true })
            }
            if (!password) {
                setError({ ...error, password: true })
            }
            return
        }

        try {
            const user = await loginService.login({ username, password })
            dispatch(login(user))
            navigate('/')
        } catch (error) {
            setErrorMessage(error.response.data.error)
        }
    }

    return (
        <Form
            username={username}
            setUsername={setUsername}
            password={password}
            setPassword={setPassword}
            error={error}
            errorMessage={errorMessage}
            onSubmit={handLogin}
            buttonText="Login"
        />
    )
}

const RegisterForm = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState({
        username: false,
        password: false,
    })
    const [errorMessage, setErrorMessage] = useState(null)

    const handleRegister = async (event) => {
        event.preventDefault()
        if (!username || !password) {
            if (!username) {
                setError({ ...error, username: true })
            }
            if (!password) {
                setError({ ...error, password: true })
            }
            return
        }

        try {
            await userService.create({ username, password })
            const user = await loginService.login({ username, password })
            dispatch(login(user))
            navigate('/')
            return user
        } catch (error) {
            setErrorMessage(error.response.data.error)
        }
    }

    return (
        <Form
            username={username}
            setUsername={setUsername}
            password={password}
            setPassword={setPassword}
            error={error}
            errorMessage={errorMessage}
            onSubmit={handleRegister}
            buttonText="Register"
        />
    )
}

export { LoginForm, RegisterForm }
export default LoginForm
