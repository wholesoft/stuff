import { useState, useRef, useEffect } from "react"
import { useAxiosPrivate } from "../hooks/useAxiosPrivate"
import { Toast } from "primereact/toast"
import { ProgressBar } from "primereact/progressbar"

const AddItemImage = ({ setItemId, item_id, group_id, image }) => {
  const axiosPrivate = useAxiosPrivate()
  const toastRef = useRef()
  const [errorMessage, setErrorMessage] = useState("")
  const [file, setFile] = useState()
  const [imageName, setImageName] = useState(image)
  const [progress, setProgress] = useState(50)
  //const [itemId, setItemId] = useState(props.item_id)
  console.log("PROPS")
  //console.log(props)
  let itemId = item_id
  //let setItemId = props.set_id
  let groupId = group_id
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
    formData.append("group_id", groupId)
    console.log("ADDING IMAGE TO ID:")
    console.log(itemId)
    //console.log("POSTING IMAGE")

    const result = await axiosPrivate.post("/edit_item_image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (event) => {
        setProgress(Math.round(100 * event.loaded) / event.total)
      },
    })
    const message = result.data.message
    const success = result.data.success
    setItemId(result.data.item_id)
    console.log(result.data)
    if (success) {
      setImageName(result.data.image)
      toastRef.current.show({
        severity: "info",
        summary: "Success",
        detail: message,
      })
    } else {
      setErrorMessage(message)
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
      <ProgressBar value={progress}></ProgressBar>
      <img
        style={{ width: "300px", height: "225px", objectFit: "scale-down" }}
        src={`${BASE_URL}/images/${imageName}`}
        alt=""
      />
    </>
  ) : (
    <>
      <label
        htmlFor={`getFile${itemId}`}
        className="p-button p-component select-image-button"
      >
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
      {errorMessage}
    </>
  )
}

export { AddItemImage }
