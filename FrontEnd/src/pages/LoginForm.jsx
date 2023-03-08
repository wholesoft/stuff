import * as React from 'react';
import FormInput from "../components/FormInput001";

const LoginForm = () => {

    const [values, setValues] = React.useState({
        email: "",
        password: ""
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
          errorMessage:"invalid password",
          label: "Password",
          required: true,
        }
      ];
    
      const handleSubmit = (e) => {
        e.preventDefault();
        console.log(values);

        fetch("http://127.0.0.1:3000/login", {
          method: 'POST',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values)
      }).then(response => response.json())
      .then(json => {
        console.log('parsed json', json) // access json.body here
      })
    }
      const onChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
      };
    
      return (
          <form onSubmit={handleSubmit}>
            <h1>Login</h1>
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

export { LoginForm };