import { useState } from "react"
import { Outlet } from "react-router-dom"
import useAuth from "../hooks/useAuth"
import { Sidebar } from "primereact/sidebar"
import { Button } from "primereact/button"
import { NavigationMenu } from "./NavigationMenu"
import { Link } from "react-router-dom"
import { NavMenu } from "./NavMenu"

const Layout = () => {
  const [activeSidebar, setActiveSidebar] = useState(false)

  const { auth } = useAuth()

  const hideSidebar = () => {
    setActiveSidebar(false)
  }

  return (
    <>
      <div className="topbar grid grid-nogutter shadow-2 px-2">
        <div className="col-fixed py-2" style={{ width: "50px" }}>
          <Link to="/">
            <img className="logo" src="/logo.svg" />
          </Link>
        </div>
        <div className="col-fixed py-2" style={{ width: "170px" }}>
          <Link to="/">
            <h1 className="title text-xl">Wholesoft Stuff</h1>
          </Link>
        </div>

        <div className="col text-base" style={{ marginTop: "3px" }}>
          <NavMenu />
        </div>
        {/*
        <Button
          icon="pi pi-bars"
          className="p-button-rounded"
          onClick={() => setActiveSidebar(false)}
        />
        <span>{auth?.email}</span>
  */}
      </div>

      <article className="content p-3">
        <Outlet />
      </article>

      <footer className="footer py-3">
        <Link to="/">Stuff</Link>
      </footer>

      <Sidebar visible={activeSidebar} onHide={() => setActiveSidebar(false)}>
        <NavigationMenu hideSidebar={hideSidebar} />
      </Sidebar>
    </>
  )
}

export { Layout }
