import { Toast } from "primereact/toast"
import {
  createContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
} from "react"

export const PrimeToastContext = createContext(null)

const PrimeToastProvider = ({ children }) => {
  const toast = useRef(null)

  const showToast = (toastObject) => {
    toast.current.show(toastObject)
  }

  useLayoutEffect(() => {
    window.PrimeToast = toast.current || {}
  }, [])

  const state = useMemo(
    () => ({
      showToast,
    }),
    []
  )

  useEffect(() => {
    console.log({ PrimeToast: window.PrimeToast })
  })

  return (
    <PrimeToastContext.Provider value={state}>
      <Toast ref={toast} />
      {children}
    </PrimeToastContext.Provider>
  )
}

export default PrimeToastProvider
