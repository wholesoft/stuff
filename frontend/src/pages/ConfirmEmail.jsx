import React, { useState, useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import { useConfirmEmail } from "../data/user/useUser"
import { tabTitle } from "../utils/helperFunctions"

const ConfirmEmail = () => {
  const { token } = useParams()
  const [message, setMessage] = useState("")

  const confirmEmailMutation = useConfirmEmail(setMessage)
  //const { isLoading, isSuccess, error, mutate } = useConfirmEmail()

  useEffect(() => {
    confirmEmailMutation.mutate(token)
  }, [])

  if (confirmEmailMutation.isLoading) return <h1>Loading...</h1>
  if (confirmEmailMutation.isError) {
    return <pre>{JSON.stringify(confirmEmailMutation.error)}</pre>
  }

  return (
    <>
      {tabTitle("Confirm Email - Wholesoft Stuff")}
      <p>{message}</p>
    </>
  )
}

export { ConfirmEmail }
