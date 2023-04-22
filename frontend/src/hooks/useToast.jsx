import { useContext } from "react"
import { PrimeToastContext } from "../context/ToastProvider"

const useToast = () => useContext(PrimeToastContext)

export default useToast
