import './App.css'
import Nav from './components/Nav'
import Footer from './components/Footer'
import Registro from './components/Registro'
import Login from './components/Login'
import Agregar from './components/Agregar'
import ListaProductos from './components/Productos'
import ListaCategorias from './components/Categorias'
import Home from './components/Home'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState } from 'react'

const NoMatch = () => {
  return <h2>404 Página no encontrada</h2>;
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
    return(
    <div className='app'>
      <BrowserRouter>
      <Nav isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/create' element={<Agregar />} />
        <Route path='/products' element={<ListaProductos/>} />
        <Route path='/categories' element={<ListaCategorias/>} />
        <Route path='/login' element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/signup" element={<Registro />} />
        <Route path='*' element={<NoMatch />} />
      </Routes>
      </BrowserRouter>
      <Footer/ >
    </div>
  )
}

export default App
