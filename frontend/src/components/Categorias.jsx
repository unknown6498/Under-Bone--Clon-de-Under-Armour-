import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import apiClient from '../api/axiosConfig';

Modal.setAppElement('#root');

const ListaCategorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [error, setError] = useState("");
  const [categoriaParaEditar, setCategoriaParaEditar] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
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
        setError("Error al cargar las categorías");
        console.error(err);
      }
    };

    fetchCategorias();
  }, []);

  const eliminarCategoria = async (id) => {
    try {
      await apiClient.delete(`/categorias/${id}`);
      setCategorias(categorias.filter(categoria => categoria._id !== id));
    } catch (err) {
      setError("Error al eliminar la categoría");
      console.error(err);
    }
  };

  const cargarDatosCategoria = (categoria) => {
    setCategoriaParaEditar(categoria);
    setModalIsOpen(true);
  };

  const actualizarCategoria = async (e) => {
    e.preventDefault();
    try {
      await apiClient.put(`/categorias/${categoriaParaEditar._id}`, categoriaParaEditar);
      setCategorias(categorias.map(p => p._id === categoriaParaEditar._id ? categoriaParaEditar : p));
      setModalIsOpen(false);
      setCategoriaParaEditar(null);
    } catch (err) {
      setError("Error al actualizar la categoría");
      console.error(err);
    }
  };

  return (
    <div className='lista container'>
      <h1>Lista de categorías</h1>
      <ul>
        <li>No.</li>
        <li>Nombre</li>
        <li>Descripción</li>
        <li>Editar&ensp;Borrar</li>
      </ul>
      {categorias.map((categoria, index) => (
        <ul key={index}>
          <li>{index + 1}</li>
          <li>{categoria.nombre}</li>
          <li>{categoria.descripcion}</li>
          <li>
            <button className='button-edit' onClick={() => cargarDatosCategoria(categoria)}>Editar</button>
            <button className='button-delete' onClick={() => eliminarCategoria(categoria._id)}>Eliminar</button>
          </li>
        </ul>
      ))}
      {error && <p className="error-message">{error}</p>}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Editar categoría"
        className="modal"
        overlayClassName="overlay"
      >
        <h2>Editar categoría</h2>
        {categoriaParaEditar && (
          <form onSubmit={actualizarCategoria}>
            <input
              type='text'
              value={categoriaParaEditar.nombre}
              onChange={(e) => setCategoriaParaEditar({ ...categoriaParaEditar, nombre: e.target.value })}
              placeholder='Nombre'
            />
            <input
              type='text'
              value={categoriaParaEditar.descripcion}
              onChange={(e) => setCategoriaParaEditar({ ...categoriaParaEditar, descripcion: e.target.value })}
              placeholder='Descripción'
            />
            <button type="submit">Guardar Cambios</button>
            <button type="button" onClick={() => setModalIsOpen(false)}>Cancelar</button>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default ListaCategorias;
