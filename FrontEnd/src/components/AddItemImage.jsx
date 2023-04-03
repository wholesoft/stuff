import { useState, useRef, useEffect } from "react"
import { useAxiosPrivate } from "../hooks/useAxiosPrivate"
import { InputText } from "primereact/inputtext"
import { Button } from "primereact/button"
import { Card } from "primereact/card"
import { Toast } from "primereact/toast"
import { FileUpload } from "primereact/fileupload"

const AddItemImage = (props) => {
  const axiosPrivate = useAxiosPrivate()
  const toastRef = useRef()
  const [responseMessage, setResponseMessage] = useState("")
  const [file, setFile] = useState()
  const [imageName, setImageName] = useState()
  const item_id = props.item_id

  const handleFileChanged = (e) => {
    setFile(e.target.files[0])
    sendImage(e.target.files[0])
  }

  const sendImage = async (f) => {
    //e.preventDefault()
    //setFile(e.files[0])
    const formData = new FormData()
    formData.append("image", f)
    formData.append("item_id", item_id)
    console.log("POSTING IMAGE")
    const result = await axiosPrivate.post("/edit_item_image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    const message = result.data.message
    const success = result.data.success
    console.log(result.data)
    if (success) {
      toastRef.current.show({
        severity: "info",
        summary: "Success",
        detail: message,
      })
    } else {
      toastRef.current.show({
        severity: "error",
        summary: "Error",
        detail: message,
      })
    }
  }

  return (
    <>
      <input
        filename={file}
        onChange={handleFileChanged}
        type="file"
        accept="image/*"
      ></input>
      <Toast ref={toastRef} />
    </>
  )
}

export { AddItemImage }
