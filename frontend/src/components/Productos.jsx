import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import apiClient from '../api/axiosConfig';

Modal.setAppElement('#root');

const ListaProductos = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [error, setError] = useState("");
  const [productoParaEditar, setProductoParaEditar] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        let response = await apiClient.get("/productos");
        const categoryResponse = await apiClient.get('/categorias');
        console.log('Productos:', response.data.data);
        console.log('Categorias:', categoryResponse.data.data);

        (Array.isArray(response.data.data) && Array.isArray(categoryResponse.data.data)) 
          setProductos(response.data.data);
          setCategorias(categoryResponse.data.data);
      } catch (err) {
        setError("Error al cargar los productos");
        console.error(err);
      }
    };

    fetchProductos();
  }, []);

  const eliminarProducto = async (id) => {
    try {
      await apiClient.delete(`/productos/${id}`);
      setProductos(productos.filter(producto => producto._id !== id));
    } catch (err) {
      setError("Error al eliminar el producto");
      console.error(err);
    }
  };

  const cargarDatosProducto = (producto) => {
    setProductoParaEditar(producto);
    setModalIsOpen(true);
  };

  const actualizarProducto = async (e) => {
    e.preventDefault();
    try {
      await apiClient.put(`/productos/${productoParaEditar._id}`, productoParaEditar);
      setProductos(productos.map(p => p._id === productoParaEditar._id ? productoParaEditar : p));
      setModalIsOpen(false);
      setProductoParaEditar(null);
    } catch (err) {
      setError("Error al actualizar el producto");
      console.error(err);
    }
  };

  return (
    <div className='lista container'>
      <h1>Lista de Productos</h1>
      <ul>
        <li>No.</li>
        <li>Nombre</li>
        <li>Descripción</li>
        <li>Precio</li>
        <li>Categoría</li>
        <li>Cantidad</li>
        <li>Editar&ensp;Borrar</li>
      </ul>
      {productos.map((producto, index) => (
        <ul key={index}>
          <li>{index + 1}</li>
          <li>{producto.nombre}</li>
          <li>{producto.descripcion}</li>
          <li>{producto.precio}</li>
          <li>
            {categorias.find((cat) => cat._id === producto.categoria)?.nombre || 'Categoría no encontrada'}
          </li>
          <li>{producto.cantidad}</li>
          <li>
            <button className='button-edit' onClick={() => cargarDatosProducto(producto)}>Editar</button>
            <button className='button-delete' onClick={() => eliminarProducto(producto._id)}>Eliminar</button>
          </li>
        </ul>
      ))}
      {error && <p className="error-message">{error}</p>}

      <Modal
        isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)} contentLabel="Editar Producto" className="modal" overlayClassName="overlay"
      >
        <h2>Editar Producto</h2>
        {productoParaEditar && (
          <form onSubmit={actualizarProducto}>
            <input type='text' value={productoParaEditar.nombre} onChange={(e) => setProductoParaEditar({ ...productoParaEditar, nombre: e.target.value })} placeholder='Nombre' />
            <input type='text' value={productoParaEditar.descripcion} onChange={(e) => setProductoParaEditar({ ...productoParaEditar, descripcion: e.target.value })} placeholder='Descripción' />
            <input type='text' value={productoParaEditar.precio} onChange={(e) => setProductoParaEditar({ ...productoParaEditar, precio: e.target.value })} placeholder='Precio' />
            <select value={productoParaEditar.categoria} onChange={(e) => setProductoParaEditar({ ...productoParaEditar, categoria: e.target.value })} aria-label="Seleccione una categoría" >
              <option value="" disabled>Selecciona una categoría</option>
              {categorias.map((cat, index) => (
                <option key={index} value={cat._id}>{cat.nombre}</option>
              ))}
            </select>
            <input type='text' value={productoParaEditar.cantidad} onChange={(e) => setProductoParaEditar({ ...productoParaEditar, cantidad: e.target.value })} placeholder='Cantidad'
            />
            <button type="submit">Guardar Cambios</button>
            <button type="button" onClick={() => setModalIsOpen(false)}>Cancelar</button>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default ListaProductos;
