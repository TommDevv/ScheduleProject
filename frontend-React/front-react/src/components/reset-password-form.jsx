import { useState } from "react";
import {useNavigate} from 'react-router-dom';
import { request } from "../api/http";
import './login-form.css'

export default function ResetPasswordForm() {

    const [formPassword, setFormPassword] = useState({
        documento: '',
        password: '',
        confirmPassword: ''
    });

    const [errorDisplay, setErrorDisplay] = useState(false);

    const navigate = useNavigate();

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormPassword({
            ...formPassword,
            [name]: value
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            "documento": formPassword.documento,
            "new_password": formPassword.password
        }

        if(formPassword.documento === '' || formPassword.password === '' || formPassword.confirmPassword === ''){
            setErrorDisplay('Por favor llene la informacion en todos los campos');
        } else if(formPassword.password !== formPassword.confirmPassword){
            setErrorDisplay('Las contraseñas no coinciden');
        } else {
            try{
                return await request("updatePassword/", {
                    method: "PUT",
                    body: payload
                }).then(() => {
                    alert("Contraseña actualizada correctamente");
                    navigate('/');
                });
            } catch (err) {
                console.error("Error updating password:", err.message);
                alert("Se produjo un error al actualizar la contraseña: " + err.message);
                throw new Error(err.message);
            }
        }
    }

    return(
       <section style={{justifyContent: "center", alignItems: "center", display: "flex", flexDirection: "column", height: "100vh"}}>
            <div className="login-title">
                <h2 className="michroma-regular">Sistema de gestión de Agenda</h2>
            </div>
            <div className="login-card-container">
                <div className="login-form">
                    <h2>Restablecer Contraseña</h2>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="user" className="input-label">Numero de Documento:</label>
                        <input 
                            type="text" 
                            id="documento" 
                            name="documento"
                            className="input-field" 
                            value={formPassword.documento} 
                            onChange={handleChange} 
                            placeholder="Ingrese su numero de documento..."
                        ></input>
                        <label htmlFor="password" className="input-label">Nueva Contraseña:</label>
                        <input 
                            type="password" 
                            id="password" 
                            name="password"
                            className="input-field" 
                            value={formPassword.password} 
                            onChange={handleChange} 
                            placeholder="Ingrese su contraseña..."
                        ></input>
                        <label htmlFor="confirmPassword" className="input-label">Confirmar Nueva Contraseña:</label>
                        <input 
                            type="password" 
                            id="confirmPassword" 
                            name="confirmPassword"
                            className="input-field" 
                            value={formPassword.confirmPassword} 
                            onChange={handleChange} 
                            placeholder="Ingrese su contraseña..."
                        ></input>
                        <span className="error-message">{errorDisplay}</span>
                        <button type="submit" className="form-button">Restablecer</button>
                    </form>
                </div>
            </div>
            <div style={{display: "flex", flexDirection: "column", alignItems: "center", marginTop: "20px", paddingLeft: "100px", paddingRight: "100px"}}>
                <button className="form-button" onClick={() => navigate('/')} style={{backgroundColor: "red"}}>Regresar</button>
            </div>
        </section>
    )
}