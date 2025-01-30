import { useState, useEffect } from "react"; 
import { useNavigate } from "react-router-dom"; 
import PropTypes from 'prop-types';
import apiClient from "../api/axiosConfig";

const Login = ({ setIsAuthenticated }) => {
    const [correo, setCorreo] = useState("");
    const [contraseña, setContraseña] = useState(""); 
    const [error, setError] = useState(""); 
    const navigate = useNavigate(); 
    const [mensajeExito, setMensajeExito] = useState("");
    const [mensajeError, setMensajeError] = useState("");

    useEffect(() => {
        const timer = setTimeout(() => {
            setMensajeExito("");
            setMensajeError("");
        }, 3000); // 3000 milisegundos = 3 segundos

        return () => clearTimeout(timer);
    }, [mensajeExito, mensajeError]);

    const InicioSesion = async () => {
        if (!correo || !contraseña) {
            setError(true);
            setMensajeError("Por favor, completa todos los campos");
            return false;
        }
        setError(false);
        setMensajeError("");
        try {
            const userResponse = await apiClient.post("/usuarios/iniciarsesion", {
                correo, 
                contraseña, 
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log("Respuesta del servidor:", userResponse.data);
            if (userResponse.data && userResponse.data.token) {
                localStorage.setItem("token", userResponse.data.token); 
                localStorage.setItem("usuario", JSON.stringify({ nombre: userResponse.data.nombre })); 
                setIsAuthenticated(true); // Actualiza el estado de autenticación
                setMensajeExito("Inicio de sesión exitoso");
                navigate("/products"); 
            } else {
                setMensajeError("Inicio de sesión fallido: Datos de usuario incorrectos");
            }
        } catch (err) {
            if (err.response) {
                setMensajeError(err.response.data.mensaje || "Error al iniciar sesión");
                console.error('Error al iniciar sesión:', err.response.data);
            } else if (err.request) {
                console.error('Error en la solicitud:', err.request);
            } else {
                console.error('Error al conectar con el servidor:', err.message);
            }
        }
    };

    return (
        <div className="background container-black">
            <div className="input-container content">
                <h1>Iniciar Sesión</h1>

                <input className="input" type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} placeholder="Correo Electrónico" />
                {error && !correo && <span className="input-error">Ingresa un correo válido</span>}

                <input className="input" type="password" value={contraseña} onChange={(e) => setContraseña(e.target.value)} placeholder="Contraseña" />
                {error && !contraseña && <span className="input-error">Ingresa una contraseña válida</span>}

                <button onClick={InicioSesion} className="input" type="button">Ingresar</button>
                {mensajeExito && <p className="success-message">{mensajeExito}</p>}
                {mensajeError && <p className="error-message">{mensajeError}</p>}
            </div>
        </div>
    );
}

Login.propTypes = {
    setIsAuthenticated: PropTypes.func.isRequired
};

export default Login;

