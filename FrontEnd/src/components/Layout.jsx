import { useState } from "react"
import { Outlet } from "react-router-dom"
import useAuth from "../hooks/useAuth"
import { Sidebar } from "primereact/sidebar"
import { Button } from "primereact/button"
import { Menu } from "primereact/menu"

const Layout = () => {
  const [activeSidebar, setActiveSidebar] = useState(false)
  const items = [
    { label: "New", icon: "pi pi-fw pi-plus" },
    { label: "Delete", icon: "pi pi-fw pi-trash" },
  ]
  const { auth } = useAuth()

  return (
    <div className="App">
      <div className="topbar shadow-2 px-2 py-1">
        <Button
          icon="pi pi-bars"
          className="p-button-rounded"
          onClick={() => setActiveSidebar(true)}
        />
      </div>

      <article className="content p-3">
        <Outlet />
      </article>

      <footer className="footer py-3">
        <a href="/">Stuff</a>
      </footer>

      <Sidebar visible={activeSidebar} onHide={() => setActiveSidebar(false)}>
        <Menu model={items} />
      </Sidebar>
    </div>
  )
}

export { Layout }
