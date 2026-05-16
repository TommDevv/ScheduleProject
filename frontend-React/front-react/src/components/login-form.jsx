import { useState } from "react";
import {useNavigate} from 'react-router-dom';
import { requestLogin } from "../api/auth.service";
import './login-form.css'

function LoginForm() {

    const [formLogin, setFormLogin] = useState({
        user: '',
        password: ''
    });

    const [errorDisplay, setErrorDisplay] = useState(false);

    const navigate = useNavigate();

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormLogin({
            ...formLogin,
            [name]: value
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        localStorage.removeItem("token");
        const payload = {
            "nickname": formLogin.user,
            "password": formLogin.password
        };

        if(formLogin.user === '' || formLogin.password === ''){
            setErrorDisplay('Usuario y contraseña son requeridos');
        } else {
            try{
                const response = await requestLogin(payload);
                if(response){
                    navigate('/dashboard')
                    console.log(response);
                    setErrorDisplay(false);
                    localStorage.setItem("token", response.access);
                }
            } catch (err){
                console.log(err);
                setErrorDisplay('Usuario o Contraseña incorrectos');
            }
        }



    }

    return (
        <section style={{justifyContent: "center", alignItems: "center", display: "flex", flexDirection: "column", height: "100vh"}}>
            <div className="login-title">
                <h2 className="michroma-regular">Sistema de gestión de Agenda</h2>
            </div>
            <div className="login-card-container">
                <div className="login-form">
                    <h2>Inicio de Sesión</h2>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="user" className="input-label">Usuario:</label>
                        <input 
                            type="text" 
                            id="user" 
                            name="user"
                            className="input-field" 
                            value={formLogin.user} 
                            onChange={handleChange} 
                            placeholder="Ingrese su nombre de usuario..."
                        ></input>
                        <label htmlFor="password" className="input-label">Contraseña:</label>
                        <input 
                            type="password" 
                            id="password" 
                            name="password"
                            className="input-field" 
                            value={formLogin.password} 
                            onChange={handleChange} 
                            placeholder="Ingrese su contraseña..."
                        ></input>
                        <span className="error-message">{errorDisplay}</span>
                        <button type="submit" className="form-button">Ingresar</button>
                    </form>
                    <div style={{display: "flex", flexDirection: "row", textAlign: "center", marginTop: "20px"}}>
                        <span>No tiene cuenta? <a href="/register">Regístrese aquí</a></span>
                        <span>Olvidó su contraseña? <a href="/forgot-password">Restablecer aquí</a></span>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default LoginForm;