
import './App.css'

import LoginForm from './components/login-form.jsx'
import Dashboard from './components/dashboard.jsx'
import ResetPasswordForm from './components/reset-password-form.jsx'
import RegisterForm from './components/register-form.jsx'

import {BrowserRouter as Router, Routes , Route} from 'react-router-dom';

function App() {

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<LoginForm/>}/>
          <Route path="/dashboard" element={<Dashboard/>}/>
          <Route path="/forgot-password" element={<ResetPasswordForm/>}/>
          <Route path="/register" element={<RegisterForm/>}/>
        </Routes>
      </Router>
    </div>
  )
}

export default App
