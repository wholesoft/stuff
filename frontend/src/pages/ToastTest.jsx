import useToast from "../hooks/useToast"

const fakeUrl = "https://api.afakeurl.com/hello"

const ToastTest = () => {
  const { showToast } = useToast()

  const showSuccess = () => {
    showToast({
      severity: "success",
      summary: "Success Message",
      detail: "Order submitted",
    })
  }

  const handleErrorFetch = () => {
    fetch(fakeUrl)
      .then((res) => res.data)
      .catch((err) => {
        console.error("error fetching request", err)
        if (window.PrimeToast) {
          window.PrimeToast.show({
            severity: "error",
            summary: "Error calling https",
            detail: "hello",
          })
        }
      })
  }

  return (
    <div className="App">
      <button onClick={showSuccess}>Show Success</button>
      <button onClick={handleErrorFetch}>Trigger fetch error</button>
      <p>Here's to you kid!</p>
    </div>
  )
}

export { ToastTest }
