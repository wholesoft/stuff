import { useState, useRef } from "react"
import { useAxiosPrivate } from "../hooks/useAxiosPrivate"
import { InputText } from "primereact/inputtext"
import { Button } from "primereact/button"
import { Toast } from "primereact/toast"
import useAuth from "../hooks/useAuth"
import { Card } from "primereact/card"

const UpdateEmailForm = () => {
  const { auth } = useAuth()
  const [email, setEmail] = useState(auth.email)
  const toastRef = useRef()
  const axiosPrivate = useAxiosPrivate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axiosPrivate.post(
        "/update_email_address",
        JSON.stringify({ email }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      )
      console.log(JSON.stringify(response?.data))
      const message = response?.data?.message
      const success = response?.data?.success
      toastRef.current.show({
        severity: "info",
        summary: success,
        detail: message,
      })
      //navigate(from, {replace: true });
    } catch (err) {
      console.log("ERROR FOUND")
      console.log(err.message)
      if (!err?.response) {
        toastRef.current.show({
          severity: "info",
          summary: "Error",
          detail: "No Server Response.",
        })
        console.log("NO RESPONSE")
      } else if (err.response?.status === 400) {
        toastRef.current.show({
          severity: "info",
          summary: "Error",
          detail: "Missing Email.",
        })
        console.log("MISSING EMAIL")
      } else {
        toastRef.current.show({
          severity: "info",
          summary: "Error",
          detail: "Unauthorized.",
        })
        console.log("UNAUTHORIZED")
      }
    }
  }

  return (
    <>
      <Card title="Update Email Address" className="col-12 md:col-6">
        <div className="p-fluid">
          <form onSubmit={handleSubmit}>
            <span className="p-float-label mt-3">
              <InputText
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label htmlFor="email">Email:</label>
            </span>
          </form>
        </div>
        <Button label="Update" icon="pi pi-check" />
        <Toast ref={toastRef} />
      </Card>
    </>
  )
}

export { UpdateEmailForm }
