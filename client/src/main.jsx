import { StrictMode } from 'react'
import  {createRoot} from "react-dom/client"
import { createBrowserRouter, RouterProvider} from "react-router-dom"
import './index.css'
import MethodSelector from './components/methodSelector.jsx'
import Main from './components/main.jsx'
import Error from './error.jsx'
import { disableReactDevTools } from '@fvilers/disable-react-devtools'

process.env.NODE_ENV === 'production' && disableReactDevTools()

const router = createBrowserRouter([
  {
    path: '/',
    element: <MethodSelector />,
    errorElement: <Error />
  },
  {
    path: '/name',
    element: <Main method="name" />,
    errorElement: <Error />
  },
  {
    path: '/composition',
    element: <Main method="composition" />,
    errorElement: <Error />
  }
])

createRoot(document.getElementById('root')).render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
)
