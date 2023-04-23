import { useState, useRef, useEffect } from "react"
import { useAxiosPrivate } from "../hooks/useAxiosPrivate"
import { Toast } from "primereact/toast"
import { ProgressBar } from "primereact/progressbar"
import { useQueryClient } from "@tanstack/react-query"

const AddNewItem = ({ groupId }) => {
  const axiosPrivate = useAxiosPrivate()
  const toastRef = useRef()
  const [errorMessage, setErrorMessage] = useState("")
  const [file, setFile] = useState()
  const [imageName, setImageName] = useState("")
  const [progress, setProgress] = useState(0)

  const queryClient = useQueryClient()

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
    formData.append("item_id", 0)
    formData.append("group_id", groupId)
    console.log("ADDING IMAGE TO ID:")
    //console.log(itemId)
    //console.log("POSTING IMAGE")

    axiosPrivate
      .post("/edit_item_image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (event) => {
          setProgress(Math.round((100 * event.loaded) / event.total))
        },
      })
      .then((result) => {
        const message = result.data.message
        const success = result.data.success
        //setItemId(result.data.item_id)
        console.log(result.data)
        if (success) {
          queryClient.invalidateQueries({ queryKey: ["items"][groupId] })
          //setImageName(result.data.image)
          setProgress(0)

          /*           toastRef.current.show({
            severity: "info",
            summary: "Success",
            detail: message,
          }) */
        } else {
          setErrorMessage(message)
          /*           toastRef.current.show({
            severity: "error",
            summary: "Error",
            detail: message,
          }) */
          setImageName("")
        }
      })
  }

  console.log(progress)

  return imageName ? (
    <>
      <img
        style={{ width: "300px", height: "225px", objectFit: "scale-down" }}
        src={`${BASE_URL}/images/${imageName}`}
        alt=""
      />
    </>
  ) : progress > 0 ? (
    <>
      <ProgressBar value={progress}></ProgressBar>
    </>
  ) : (
    <>
      <div className="flex align-items-center">
        <label
          htmlFor={`getFile`}
          className="pb-2 pi pi-plus-circle p-component select-image-button hover: cursor-pointer"
          style={{ fontSize: "2.0rem", color: "blue" }}
        ></label>
      </div>
      <input
        style={{ display: "none" }}
        id={`getFile`}
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

export { AddNewItem }
