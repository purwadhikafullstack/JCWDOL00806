import React from 'react'
import { Routes, Route } from 'react-router-dom'

import Login from './pages/Login'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<h1>Landing pages</h1>} />
        <Route path='/users/login' element={<Login />} />
      </Routes>
    </div>
  )
}

export default App