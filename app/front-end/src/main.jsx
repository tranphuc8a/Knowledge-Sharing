import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import MyRoute from './components/router/route.jsx'
import GetAPI from './services/api/get-api.js'
import PostAPI from './services/api/post-api.js'


ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
    <MyRoute />
  // </React.StrictMode>,
)
