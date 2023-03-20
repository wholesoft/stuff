import { ForgotPasswordForm } from '../components/ForgotPasswordForm'


const ForgotPassword = () => {
   
    return (
      <div>
        <h1>Forgot Password</h1>
        <p>Enter the email you used to create the account with below and we'll send you a link to reset your password.</p>
        <ForgotPasswordForm />
      </div>

    )
  }

  export { ForgotPassword };