import { UpdatePassword } from "../components/UpdatePassword"
import { UpdateEmailForm } from "../components/UpdateEmailForm"

const Account = () => {
  return (
    <section>
      <UpdateEmailForm />
      <UpdatePassword />
    </section>
  )
}

export { Account }
