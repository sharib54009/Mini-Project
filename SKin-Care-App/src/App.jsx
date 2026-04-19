import {react, useState} from 'react'
import {createBrowserRouter, RouterProvider } from 'react-router-dom'
import SignUpPage from "./assets/SignUp/SignUpPage"
import LoginPage from "./assets/Login/LoginPage"
import HomePage from "./assets/HomePage/homePage"

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />
  },
  {
    path: "/signup",
    element: <SignUpPage />
  },
  {
    path: "/home",
    element: <HomePage />
  }
])

const App = () => {
 
  return (
    <div >
    <RouterProvider router={router} />
    </div>
  )
}

export default App
