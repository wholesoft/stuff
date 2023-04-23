import { tabTitle } from "../utils/helperFunctions"
import { useState, useEffect } from "react"
import axiosAuth from "../data/axios"
import authApi from "../api/axios"
import { useResourcePrivate } from "../hooks/useResourcePrivate"
import { useAxiosPrivate } from "../hooks/useAxiosPrivate"

const ImageTest = () => {
  let image_url = "/images3/a19b2ae0b18c1205905fc1e75b790831"
  const [resource, setResource] = useState(image_url)
  const axiosPrivate = useAxiosPrivate()

  useEffect(() => {
    ;(async () => {
      const response = await axiosPrivate.get(resource)
      //setMyImage(response.data)
      var image = document.getElementById("myImage")
      image.src = `data:image/png;base64, ${response.data}`
    })()
  }, [resource])

  return (
    <>
      {tabTitle("Image Test - Wholesoft Stuff")}
      TEST
      <img style={{ width: "600px" }} id="myImage" src="" />
    </>
  )
}

export { ImageTest }
