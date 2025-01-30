import { useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import logo from '../assets/undershield-icon.svg';

const NavBar = ({ isAuthenticated, setIsAuthenticated }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token'); // Elimina el token de autenticación
        localStorage.removeItem('usuario'); // Elimina la información del usuario
        setIsAuthenticated(false); // Actualiza el estado de autenticación
        navigate('/'); // Redirige al usuario a la página principal
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
        }
    }, [setIsAuthenticated]);

    return (
        <div className='nav-bar'>
            <ul className='nav-left'>
                <li className="nohover"><Link to='/'><img className="navbar-logo" src={logo}/></Link></li>
                {isAuthenticated && (
                    <>
                        <li><Link to='/create'>Agregar</Link></li>
                        <li><Link to='/products'>Productos</Link></li>
                        <li><Link to='/categories'>Categorías</Link></li>
                    </>
                )}
            </ul>
            <ul className='nav-right'>
                {isAuthenticated ? (
                    <>
                        <li><a href="#!" onClick={handleLogout}>Cerrar Sesión</a></li>
                    </>
                ) : (
                    <>
                        <li><Link to='/login'>Iniciar Sesión</Link></li>
                        <li><Link to='/signup'>Registrarse</Link></li>
                    </>
                )}
            </ul>
        </div>
    );
}

NavBar.propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    setIsAuthenticated: PropTypes.func.isRequired
};

export default NavBar;
