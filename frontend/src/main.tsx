import React from 'react'
import ReactDOM from 'react-dom/client'
import '@src/index.css'
import { RouterProvider } from 'react-router-dom'
import { routes } from '@src/App'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={routes} />
  </React.StrictMode>,
)
