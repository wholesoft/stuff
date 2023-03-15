const RegistrationConfirmed = () => {

    return (
      <div>
        <p>Thank you for making an account.</p>
        <p>Please check your email and confirm your email to log in.</p>
        <p>Don't see it?  Check your spam folder or request it to be sent again.</p>
        <p>{localStorage.getItem("unconfirmed_email")}</p>

      </div>
    )
  }

  export { RegistrationConfirmed };