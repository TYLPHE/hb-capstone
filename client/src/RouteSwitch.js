import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Homepage from './pages/Homepage';
import NoMatch from './pages/NoMatch';

export default function RouteSwitch() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Homepage />} />
        <Route path='/register' element={<Register />} />
        <Route path='*' element={<NoMatch />} />
      </Routes>
    </BrowserRouter>
  )
}
