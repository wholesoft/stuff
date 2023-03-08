import './App.css'
import { Route, Routes, Link, NavLink } from 'react-router-dom'
import { RegisterForm } from './pages/RegisterForm'
import { LoginForm } from './pages/LoginForm'
import { AddRecordForm } from './test/AddRecordForm'
import { Home } from './pages/Home'
import { Stuff } from './pages/Stuff'
import { StuffItems } from './pages/StuffItems'
import { NotFound } from './pages/NotFound'


function App() {

 
    
    return (
        <div className='app'>
            <nav>
<ul>
<li><NavLink to="/">Home</NavLink></li>
<li><NavLink to="/stuff">Stuff</NavLink></li>
<li><NavLink to="/addrecord">Add Record Form</NavLink></li>
<li><NavLink to="/register">Register</NavLink></li>
<li><NavLink to="/login">Login</NavLink></li>
</ul>

            </nav>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/stuff">
                <Route index element={<Stuff />} />
                <Route path=":category" element={<StuffItems />} />
            </Route>
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/addrecord" element={<AddRecordForm />} />
            <Route path="*" element={<NotFound />} />
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