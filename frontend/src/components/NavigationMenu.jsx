import { useState } from "react"
import { Menu } from "primereact/menu"
import { useNavigate } from "react-router-dom"
import useLogout from "../hooks/useLogout"
import useAuth from "../hooks/useAuth"

const NavigationMenu = ({ hideSidebar }) => {
  const navigate = useNavigate()
  const logout = useLogout()
  const { auth } = useAuth()
  console.log(auth)

  const signOut = async () => {
    await logout()
    navigate("/")
  }

  // NOT LOGGED IN
  let items = [
    {
      label: "Home",
      command: () => {
        navigate("/")
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

  // LOGGED IN USER
  if (auth?.roles?.includes(1001)) {
    items = [
      {
        label: "Home",
        command: () => {
          navigate("/")
          hideSidebar()
        },
      },
      {
        label: "My Stuff",
        command: () => {
          navigate("/mystuff")
          hideSidebar()
        },
      },
      {
        label: "My Account",
        command: () => {
          navigate("/account")
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
    ]
  }

  // ADMIN
  if (auth?.roles?.includes(2001)) {
    items.push({
      label: "Admin",
      command: () => {
        navigate("/admin")
        hideSidebar()
      },
    })
  }

  return (
    <>
      <Menu model={items} />
    </>
  )
}

export { NavigationMenu }
