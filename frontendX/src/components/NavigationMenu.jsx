import { useState } from "react"
import { Menu } from "primereact/menu"
import { useNavigate } from "react-router-dom"
import useLogout from "../hooks/useLogout"
import useAuth from "../hooks/useAuth"

const NavigationMenu = ({ hideSidebar }) => {
  const navigate = useNavigate()
  const logout = useLogout()
  const { auth } = useAuth()

  const signOut = async () => {
    await logout()
    navigate("/")
  }

  const items = [
    {
      label: "Home",
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
    {
      label: "Admin",
      command: () => {
        navigate("/admin")
        hideSidebar()
      },
    },
    {
      label: "Logout",
      command: () => {
        signOut()
        hideSidebar()
      },
    },
    {
      label: "Login",
      command: () => {
        navigate("/login")
        hideSidebar()
      },
    },
    {
      label: "Register",
      command: () => {
        navigate("/register")
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
