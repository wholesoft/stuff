import * as React from 'react';
import FormInput from "../components/FormInput001";

const RegisterForm = () => {

    const [values, setValues] = React.useState({
        email: "",
        password: "",
        confirm_password: "",
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
          name: "confirm_password",
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
        console.log(values);

        fetch("http://127.0.0.1:3000/register", {
          method: 'POST',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values)
      }).then(() => { 
        console.log('new record added');
      });
    }


    
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