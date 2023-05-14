import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Register from './pages/Register'
import Homepage from './pages/Homepage'

function RouteSwitch() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Homepage />} />
        <Route path='/register' element={<Register />} />
      </Routes>
    </BrowserRouter>
  )
}

export default RouteSwitch
