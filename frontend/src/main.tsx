import React from 'react'
import { createRoot } from 'react-dom/client'
import "./index.css"
import "@radix-ui/themes/styles.css"
import { Theme } from '@radix-ui/themes'
import App from './App'

const container = document.getElementById('root')

const root = createRoot(container!)

root.render(
    <React.StrictMode>
        <Theme>
            <App />
        </Theme>
    </React.StrictMode>
)
