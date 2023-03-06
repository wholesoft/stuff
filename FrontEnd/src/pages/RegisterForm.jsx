import * as React from 'react';
import FormInput from "../components/FormInput001";

const RegisterForm = () => {

    const [values, setValues] = React.useState({
        email: "",
        password: "",
        confirmPassword: "",
      });
    
      const inputs = [
        {
          id: 1,
          name: "email",
          type: "email",
          placeholder: "Email",
          errorMessage: "invalid email address",
          label: "Email",
          required: true,
        },
        {
          id: 2,
          name: "password",
          type: "password",
          placeholder: "Password",
          errorMessage:
            "password should be 8-20 characters and include at least 1 letter, 1 number and 1 special character",
          label: "Password",
          pattern: `^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$`,
          required: true,
        },
        {
          id: 3,
          name: "confirmPassword",
          type: "password",
          placeholder: "Confirm Password",
          errorMessage: "passwords don't match",
          label: "Confirm Password",
          pattern: values.password,
          required: true,
        },
      ];
    
      const handleSubmit = (e) => {
        e.preventDefault();

        // client side validation is okay
        // need to check on the server to see if the email already exists

        // other than that need to do the server-side validation
        // and add the user to the database
        // send the email confirmation message
        // display an appropriate message


      };
    
      const onChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
      };
    
      return (
          <form onSubmit={handleSubmit}>
            <h1>Register</h1>
            {inputs.map((input) => (
              <FormInput
                key={input.id}
                {...input}
                value={values[input.name]}
                onChange={onChange}
              />
            ))}
            <button>Submit</button>
          </form>
      );


}

export { RegisterForm };