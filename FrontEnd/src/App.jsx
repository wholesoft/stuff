import './App.css'
import { RequireAuth } from './components/RequireAuth'
import { PersistLogin } from './components/PersistLogin'
import { Route, Routes, Link, NavLink } from 'react-router-dom'
import { RegisterForm } from './pages/RegisterForm'
import { Login } from './pages/Login'
import { AddRecordForm } from './test/AddRecordForm'
import { Home } from './pages/Home'
import { Stuff } from './pages/Stuff'
import { StuffItems } from './pages/StuffItems'
import { NotFound } from './pages/NotFound'
import { Admin } from './pages/Admin'
import { Notes } from './pages/Notes'
import { Layout } from './components/Layout'
import { Unauthorized } from './pages/Unauthorized'
 
const ROLES = {
    'User': 1001,
    'Admin': 2001
}

function App() {

 
    
    return (
        <div className='app'>

        <Routes>
            <Route path="/" element={<Layout />}>
                {/* public routes */}
                <Route path="/register" element={<RegisterForm />} />
                <Route path="/login" element={<Login />} />
                <Route path="/unauthorized" element={<Unauthorized />} />

                {/* we want to protect these routes */}
                <Route element={<PersistLogin />}> 
                    <Route element={<RequireAuth allowedRoles={[ROLES.User]} />}>
                        <Route path="/" element={<Home />} />
                        <Route path="/stuff"> 
                            <Route index element={<Stuff />} />
                            <Route path=":category" element={<StuffItems />} />
                        </Route>
                        <Route path="/addrecord" element={<AddRecordForm />} />
                        <Route path="/notes" element={<Notes />} />
                    </Route>

                    <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
                        <Route path="/admin" element={<Admin />} />
                    </Route>
                </Route>


                {/* catch all */}
                <Route path="*" element={<NotFound />} />
            </Route>
      </Routes>
      </div>
    )
  }
  
  export default App

  /*
        <div className='app'>
        <RegisterForm />
      </div>
*/