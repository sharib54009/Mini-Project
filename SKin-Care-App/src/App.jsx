import {react, useState} from 'react'
import SignUpPage from "./assets/Login&SignUp/SignUpPage"
import LoginPage from "./assets/Login&SignUp/LoginPage"


const App = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div >
     {isLogin ? (
      <LoginPage switchToSignUp = {() => setIsLogin(false)} />
     ) : ( <SignUpPage switchToLogin = {() => setIsLogin(true)} />
     )}
    </div>
  )
}

export default App
