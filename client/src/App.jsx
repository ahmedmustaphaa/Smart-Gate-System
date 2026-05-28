import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Overview from './pages/Overview'
import Activity from './pages/Activity'
import Gate from './pages/Gate'
import Permissions from './pages/Permissions'
import Settings from './pages/Settings'
import Login from './pages/Login'
import {Toaster} from 'react-hot-toast'
import ProtectedRoute from './pages/ProtectedRoute'
function App() {
  return (
    <div>
      <Toaster position="top-right" />


      <Routes>
        <Route path='/login' element={<Login/>} />
         <Route  path='/' element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
         }>
         <Route index element={<Overview/>}></Route>
         <Route path='activity-logs' element={<Activity/>}></Route>
         <Route path='gate-management' element={<Gate/>}></Route>
         <Route path='permissions-owners' element={<Permissions/>}></Route>
         <Route path='settings' element={<Settings/>}></Route>

         </Route>
      </Routes>
        
    </div>
  )
}

export default App
