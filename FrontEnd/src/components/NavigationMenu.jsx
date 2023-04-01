import { useState } from "react"
import { Menu } from "primereact/menu"
import { useNavigate } from "react-router-dom"

const NavigationMenu = ({ hideSidebar }) => {
  const navigate = useNavigate()

  const items = [
    {
      label: "My Stuff",
      command: () => {
        navigate("/")
        hideSidebar()
      },
    },
    {
      label: "Account",
      command: () => {
        navigate("/account")
        hideSidebar()
      },
    },
    ,
    {
      label: "Admin",
      command: () => {
        navigate("/admin")
        hideSidebar()
      },
    },
  ]

  return (
    <>
      <Menu model={items} />
    </>
  )
}

export { NavigationMenu }
