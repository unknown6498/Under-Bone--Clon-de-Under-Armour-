import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import apiClient from "../api/axiosConfig";

const Registro = () => {
    const [nombre, setNombre] = useState("");
    const [correo, setCorreo] = useState("");
    const [contraseña, setContraseña] = useState("");
    const navigate = useNavigate();
    const [error, setError] = useState(false);
    const [mensajeExito, setMensajeExito] = useState("");
    const [mensajeError, setMensajeError] = useState("");

    useEffect(() => {
        const timer = setTimeout(() => {
            setMensajeExito("");
            setMensajeError("");
        }, 3000); // 3000 milisegundos = 3 segundos

        return () => clearTimeout(timer);
    }, [mensajeExito, mensajeError]);

    const DatosUsuario = async () => {
        if (!nombre || !correo || !contraseña) {
            setError(true);
            setMensajeError("Por favor, completa todos los campos");
            return false;
        }
        setError(false);
        setMensajeError("");
        try {
            const resultadoUsuario = await apiClient.post('/usuarios/registro', {
                nombre,
                correo,
                contraseña
            });
            if (resultadoUsuario) {
                setMensajeExito("Registro exitoso");
                navigate('/login');
            }
        } catch (err) {
            setMensajeError("Error al enviar los datos");
            console.error('Error al enviar los datos:', err);
        }
    };

    return (
        <div className="background container-black">
            <div className="input-container content">
                <h1>Registro</h1>
                <input
                    className="input" type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre"/>
                {error && !nombre && <span className="input-error">Ingresa un nombre válido</span>}

                <input
                    className="input" type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} placeholder="Correo Electrónico"/>
                {error && !correo && <span className="input-error">Ingresa un correo válido</span>}

                <input className="input" type="password" value={contraseña} onChange={(e) => setContraseña(e.target.value)} placeholder="Contraseña"/>
                {error && !contraseña && <span className="input-error">Ingresa una contraseña válida</span>}

                <button onClick={DatosUsuario} className="input" type="button">Registrarse</button>
                {mensajeExito && <p className="success-message">{mensajeExito}</p>}
                {mensajeError && <p className="error-message">{mensajeError}</p>}
            </div>
        </div>
    );
}

export default Registro;
