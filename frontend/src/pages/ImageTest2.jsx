import { tabTitle } from "../utils/helperFunctions"
import { Image } from "../components/Image"
const ImageTest2 = () => {
  let image_url = "/images3/a19b2ae0b18c1205905fc1e75b790831"

  return (
    <>
      {tabTitle("Image Test - Wholesoft Stuff")}
      {image_url}
      <br />
      <Image src={image_url} />
    </>
  )
}

export { ImageTest2 }
