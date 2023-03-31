import { useState } from "react"
import { Menu } from "primereact/menu"
import { useNavigate } from "react-router-dom"

const NavigationMenu = () => {
  const navigate = useNavigate()

  const items = [
    {
      label: "My Stuff",
      command: () => {
        navigate("/")
      },
    },
    {
      label: "Account",
      command: () => {
        navigate("/account")
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
