import { useState, useEffect } from "react"
import { useAxiosPrivate } from "../hooks/useAxiosPrivate"

const Image = (props) => {
  let image_url = props.src
  console.log(props.id)
  console.log(image_url)
  const [resource, setResource] = useState(image_url)
  const axiosPrivate = useAxiosPrivate()

  useEffect(() => {
    ;(async () => {
      const response = await axiosPrivate.get(resource)
      var image = document.getElementById(props.id)
      image.src = `data:image/png;base64, ${response.data}`
    })()
  }, [resource])

  return <img style={props.style} id={props.id} src="" />
}

export { Image }
