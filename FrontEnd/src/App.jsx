import { RequireAuth } from './components/RequireAuth'
import { PersistLogin } from './components/PersistLogin'
import { Route, Routes, Link, NavLink } from 'react-router-dom'
import { RegisterForm } from './pages/RegisterForm'
import { Login } from './pages/Login'
import { ForgotPassword } from './pages/ForgotPassword'
import { ResetPassword } from './pages/ResetPassword'
import { PleaseConfirmEmail } from './pages/PleaseConfirmEmail'
import { RegistrationConfirmed } from './pages/RegistrationConfirmed'
import { Account } from './pages/Account'
import { UsersTable } from './pages/UsersTable'
import { ShowUser } from './pages/ShowUser'
import { Home } from './pages/Home'
import { LinkPage } from './pages/LinkPage'
import { Stuff } from './pages/Stuff'
import { StuffItems } from './pages/StuffGroupItems'
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
        <Route path="/registration_confirmed" element={<RegistrationConfirmed />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route path="/reset" element={<ResetPassword />} />
        <Route path="/unconfirmed" element={<PleaseConfirmEmail />} />
        <Route path="/linkpage" element={<LinkPage />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* we want to protect these routes */}
        <Route element={<PersistLogin />}> 
            <Route element={<RequireAuth allowedRoles={[ROLES.User]} />}>
                <Route path="/links" element={<Home />} />
                <Route path="/account" element={<Account />} />
                <Route path="/" element={<Stuff />} />
                <Route path="/stuff" element={<Stuff />} />
                <Route path="/stuff-items" element={<StuffItems />} />
            </Route>

            <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
                <Route path="/admin" element={<Admin />} />
                <Route path="/users" element={<UsersTable />} />
                <Route path="/user/:id" element={<ShowUser />} />
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