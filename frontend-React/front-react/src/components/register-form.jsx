import { useState } from "react";
import {useNavigate, Link} from 'react-router-dom';
import { request } from "../api/http";
import './login-form.css'

export default function RegisterForm() {

    const [formRegister, setFormRegister] = useState({
        nickname: '',
        password: '',
        nombre: '',
        documento: ''
    });

    const[confirmPassword, setConfirmPassword] = useState('');

    const [errorDisplay, setErrorDisplay] = useState(false);

    const navigate = useNavigate();

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormRegister({
            ...formRegister,
            [name]: value
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            "nickname": formRegister.nickname,
            "password": formRegister.password,
            "nombre": formRegister.nombre,
            "documento": formRegister.documento
        }

        if(formRegister.documento === '' || formRegister.password === '' || formRegister.nombre === ''){
            setErrorDisplay('Por favor llene la informacion en todos los campos');
        } else if(!/^\d+$/.test(formRegister.documento)) {
            setErrorDisplay('El documento debe contener solo números');
        } else if (formRegister.password !== confirmPassword){
            setErrorDisplay('Las contraseñas no coinciden');
        } else {
            try{
                return await request("register/", {
                    method: "POST",
                    body: payload
                }).then(() => {
                    alert("Usuario registrado correctamente");
                    navigate('/');
                });
            } catch (err) {
                console.error("Error registering user:", err.message);
                alert("Se produjo un error al registrar el usuario: " + err.message);
                throw new Error(err.message);
            }
        }
    }

    return(
       <section style={{justifyContent: "center", alignItems: "center", display: "flex", flexDirection: "column", height: "100vh"}}>
            <div className="login-title">
                <h2 className="michroma-regular" >Sistema de gestión de Agenda</h2>
            </div>
            <div className="login-card-container">
                <div className="login-form">
                    <h2 style={{marginTop:"20px"}}>Registrar Usuario</h2>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="user" className="input-label">Numero de Documento:</label>
                        <input 
                            type="text" 
                            id="documento" 
                            name="documento"
                            className="input-field" 
                            value={formRegister.documento} 
                            onChange={handleChange} 
                            placeholder="Ingrese su numero de documento..."
                        ></input>
                        <label htmlFor="nombre" className="input-label">Nombres:</label>
                        <input 
                            type="text" 
                            id="nombre" 
                            name="nombre"
                            className="input-field" 
                            value={formRegister.nombre} 
                            onChange={handleChange} 
                            placeholder="Ingrese su nombre completo..."
                        ></input>
                        <label htmlFor="nickname" className="input-label">Nickname:</label>
                        <input 
                            type="text" 
                            id="nickname" 
                            name="nickname"
                            className="input-field" 
                            value={formRegister.nickname} 
                            onChange={handleChange} 
                            placeholder="Ingrese su nickname..."
                        ></input>
                        <label htmlFor="password" className="input-label">Contraseña:</label>
                        <input 
                            type="password" 
                            id="password" 
                            name="password"
                            className="input-field" 
                            value={formRegister.password} 
                            onChange={handleChange} 
                            placeholder="Ingrese su contraseña..."
                        ></input>
                        <label htmlFor="confirmPassword" className="input-label">Confirmar Contraseña:</label>
                        <input 
                            type="password" 
                            id="confirmPassword" 
                            name="confirmPassword"
                            className="input-field" 
                            value={confirmPassword} 
                            onChange={(e) => setConfirmPassword(e.target.value)} 
                            placeholder="Ingrese su contraseña nuevamente..."
                        ></input>
                        <span className="error-message">{errorDisplay}</span>
                        <button type="submit" className="form-button">Registrar</button>
                    </form>
                    <div className="form-links">
                        <span>¿Ya tiene una cuenta? <Link to="/">Inicie sesión aquí</Link></span>
                    </div>
                </div>
            </div>
        </section>
    )
}