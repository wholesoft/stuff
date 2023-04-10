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
  const [itemId, setItemId] = useState(props.item_id)
  //console.log(itemId)
  let BASE_URL = "https://stuff-api.wholesoft.net"

  if (process.env.NODE_ENV == "development") {
    BASE_URL = "http://localhost:3000"
  }

  const handleFileChanged = (e) => {
    setFile(e.target.files[0])
    sendImage(e.target.files[0])
  }

  const sendImage = async (f) => {
    //e.preventDefault()
    //setFile(e.files[0])
    const formData = new FormData()
    formData.append("image", f)
    formData.append("item_id", itemId)
    //console.log("ADDING IMAGE TO ID:")
    //console.log(itemId)
    //console.log("POSTING IMAGE")
    const result = await axiosPrivate.post("/edit_item_image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    const message = result.data.message
    const success = result.data.success
    console.log(result.data)
    if (success) {
      setImageName(result.data.image)
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
      setImageName("")
    }
  }

  return imageName ? (
    <>
      <img
        style={{ maxWidth: "200px", maxHeight: "200px" }}
        src={`${BASE_URL}/images/${imageName}`}
        alt=""
      />
    </>
  ) : (
    <>
      <label htmlFor={`getFile${itemId}`} className="select-image-button">
        Select Image
      </label>
      <input
        style={{ display: "none" }}
        id={`getFile${itemId}`}
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
