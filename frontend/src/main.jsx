import React from 'react'
import ReactDOM from 'react-dom/client'
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'

import App from './App.jsx'
import movieReducer from './reducers/movieReducer.js'
import movieListReducer from './reducers/movieListReducer.js'
import userReducer from './reducers/userReducer.js'

const store = configureStore({
    reducer: {
        movies: movieReducer,
        movieList: movieListReducer,
        user: userReducer,
    },
})

ReactDOM.createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>
)
