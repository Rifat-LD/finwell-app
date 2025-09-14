import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

document.body.style.margin = '0';
document.body.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)