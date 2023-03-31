import React, { useState } from "react"
import useAuth from "../hooks/useAuth"
import { Link, useNavigate, useLocation } from "react-router-dom"
import axios from "../api/axios"
import { Password } from "primereact/password"
import { InputText } from "primereact/inputtext"
import { Checkbox } from "primereact/checkbox"
import { Button } from "primereact/button"

const LOGIN_URL = "/auth"

const Login = () => {
  const { setAuth, persist, setPersist } = useAuth()

  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || "/"

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errMsg, setErrMsg] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await axios.post(
        LOGIN_URL,
        JSON.stringify({ email, password }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      )
      console.log(JSON.stringify(response?.data))
      const access_token = response?.data?.access_token
      const roles = response?.data?.roles
      const email_confirmed = response?.data?.email_confirmed
      console.log("email_confirmed: " + email_confirmed)
      if (!email_confirmed) {
        setAuth({})
        localStorage.setItem("unconfirmed_email", email)
        setEmail("")
        setPassword("")
        navigate("/unconfirmed")
      } else {
        setAuth({ email: email, roles, access_token })
        setEmail("")
        setPassword("")
        navigate(from, { replace: true })
      }
    } catch (err) {
      console.log("ERROR FOUND")
      if (!err?.response) {
        setErrMsg("No Server Response")
        console.log("NO RESPONSE")
      } else if (err.response?.status === 400) {
        setErrMsg("Missing Email or Password")
        console.log("MISSING EMAIL OR PASSWORD")
      } else if (err.response?.staus === 401) {
        setErrMsg("Unauthorized")
        console.log("UNAUTHORIZED")
      } else {
        setErrMsg("Login Failed")
        console.log("LOGIN FAILED")
      }
    }
  }

  const togglePersist = () => {
    setPersist((prev) => !prev)
  }

  React.useEffect(() => {
    localStorage.setItem("persist", persist)
  }, [persist])

  return (
    <section>
      <h1>Sign In</h1>
      <form onSubmit={handleSubmit}>
        <br />
        <span className="p-float-label">
          <InputText
            id="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
            autoComplete="off"
          />
          <label htmlFor="enauk">Email</label>
        </span>

        <br />
        <span className="p-float-label">
          <Password
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            feedback={false}
            toggleMask
            required
          />
          <label htmlFor="password">Password</label>
        </span>
        <br />
        <Button label="Sign In" />
        <br />
        <div className="flex align-items-center mt-2">
          <Checkbox
            id="persist"
            onChange={togglePersist}
            checked={persist}
          ></Checkbox>

          <label htmlFor="persist">Trust this device</label>
        </div>
        <div></div>
        <p>
          <Link to="/forgot">Forgot Password?</Link>
          <br />
        </p>
        <p>
          <Link to="/register">Need an Account?</Link>
          <br />
        </p>
      </form>
    </section>
  )
}

export { Login }
