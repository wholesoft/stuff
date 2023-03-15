const PleaseConfirmEmail = () => {

    return (
      <div>
        <p>Please check your email and confirm your email before logging in.</p>
        <p>Don't see it?  Check your spam folder or request it to be sent again.</p>
        <p>{localStorage.getItem("unconfirmed_email")}</p>

      </div>
    )
  }

  export { PleaseConfirmEmail };