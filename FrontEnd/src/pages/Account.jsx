import { UpdatePassword } from "../components/UpdatePassword"
import { UpdateEmailForm } from "../components/UpdateEmailForm"

const Account = () => {
  return (
    <div class="flex flex-wrap">
      <UpdateEmailForm />
      <UpdatePassword />
    </div>
  )
}

export { Account }
