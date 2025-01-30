import { useState, useEffect } from "react";
import apiClient from '../api/axiosConfig';

const Agregar = () => {
    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [precio, setPrecio] = useState("");
    const [categorias, setCategorias] = useState([]);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
    const [cantidad, setCantidad] = useState("");
    const [error, setError] = useState(false);
    const [mensajeExito, setMensajeExito] = useState("");
    const [mensajeError, setMensajeError] = useState("");

    const [nombreCategoria, setNombreCategoria] = useState("");
    const [descripcionCategoria, setDescripcionCategoria] = useState("");
    const [mensajeExitoCategoria, setMensajeExitoCategoria] = useState("");
    const [mensajeErrorCategoria, setMensajeErrorCategoria] = useState("");

    useEffect(() => {
        const timer = setTimeout(() => {
            setMensajeExito("");
            setMensajeError("");
        }, 3000); // 3000 milisegundos = 3 segundos

        return () => clearTimeout(timer);
    }, [mensajeExito, mensajeError]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setMensajeExitoCategoria("");
            setMensajeErrorCategoria("");
        }, 3000); // 3000 milisegundos = 3 segundos

        return () => clearTimeout(timer);
    }, [mensajeExitoCategoria, mensajeErrorCategoria]);

    const DatosProducto = async () => {
        if (!nombre || !descripcion || !precio || !categoriaSeleccionada || !cantidad) {
            setError(true);
            setMensajeError("Por favor, completa todos los campos");
            return false;
        }
        setError(false);
        setMensajeError("");
        try {
            const resultadoProducto = await apiClient.post('/productos', {
                nombre,
                descripcion,
                precio,
                categoria: categoriaSeleccionada,
                cantidad
            });
            setMensajeExito("Producto agregado correctamente");
            console.warn(resultadoProducto.data);
        } catch (err) {
            setMensajeError("Error al enviar los datos");
            console.error('Error al enviar los datos:', err);
        }
    };

    const DatosCategoria = async () => {
        if (!nombreCategoria || !descripcionCategoria) {
            setMensajeErrorCategoria("Por favor, completa todos los campos");
            return false;
        }
        setMensajeErrorCategoria("");
        try {
            const resultadoCategoria = await apiClient.post('/categorias', {
                nombre: nombreCategoria,
                descripcion: descripcionCategoria
            });
            setMensajeExitoCategoria("Categoría agregada correctamente");
            console.warn(resultadoCategoria.data);
            
            // Actualizar la lista de categorías después de agregar una nueva
            await fetchCategorias();
        } catch (err) {
            setMensajeErrorCategoria("Error al enviar los datos de la categoría");
            console.error('Error al enviar los datos de la categoría:', err);
        }
    };

    const fetchCategorias = async () => {
        try {
            const categoryResponse = await apiClient.get('/categorias');
            console.log('Categorias:', categoryResponse.data.data);

            if (Array.isArray(categoryResponse.data.data)) {
                setCategorias(categoryResponse.data.data);
            } else {
                console.error('La respuesta no es un arreglo:', categoryResponse.data);
            }
        } catch (err) {
            setMensajeError("Error al cargar las categorías");
            console.error(err);
        }
    };

    useEffect(() => {
        fetchCategorias();
    }, []);

    return (
        <div className="background container-black">
            <div className="input-container product">
                <h1>Agregar Producto</h1>
                <input className="input" type='text' value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder='Nombre' />
                {error && !nombre && <span className="input-error">Ingresa un nombre válido</span>}

                <input className="input" type='text' value={descripcion} onChange={(e) => setDescripcion(e.target.value)} placeholder='Descripción' />
                {error && !descripcion && <span className="input-error">Ingresa una descripción válida</span>}

                <input className="input" type='text' value={precio} onChange={(e) => setPrecio(e.target.value)} placeholder='Precio' />
                {error && !precio && <span className="input-error">Ingresa un precio válido</span>}

                <select className="input" value={categoriaSeleccionada} onChange={(e) => setCategoriaSeleccionada(e.target.value)} aria-label="Seleccione una categoría">
                    <option value="" disabled>Selecciona una categoría</option>
                    {categorias.map((cat, index) => (
                        <option key={index} value={cat._id}>{cat.nombre}</option>
                    ))}
                </select>
                {error && !categoriaSeleccionada && <span className="input-error">Selecciona una categoría válida</span>}

                <input className="input" type='text' value={cantidad} onChange={(e) => setCantidad(e.target.value)} placeholder='Cantidad' />
                {error && !cantidad && <span className="input-error">Ingresa una cantidad válida</span>}

                <button onClick={DatosProducto} className="input" type="button">Agregar Producto</button>
                {mensajeExito && <p className="success-message">{mensajeExito}</p>}
                {mensajeError && <p className="error-message">{mensajeError}</p>}
            </div>
            <div className="input-container category">
                <h1>Agregar Categoría</h1>
                <input className="input" type='text' value={nombreCategoria} onChange={(e) => setNombreCategoria(e.target.value)} placeholder='Nombre' />
                {mensajeErrorCategoria && <span className="input-error">{mensajeErrorCategoria}</span>}
                
                <input className="input" type='text' value={descripcionCategoria} onChange={(e) => setDescripcionCategoria(e.target.value)} placeholder='Descripción' />
                {mensajeErrorCategoria && <span className="input-error">{mensajeErrorCategoria}</span>}     

                <button onClick={DatosCategoria} className="input" type="button">Agregar Categoría</button>
                {mensajeExitoCategoria && <p className="success-message">{mensajeExitoCategoria}</p>}
                {mensajeErrorCategoria && <p className="error-message">{mensajeErrorCategoria}</p>}
           
            </div>
        </div>
    );
};

export default Agregar;
