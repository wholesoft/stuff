import * as React from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

const AddStuffGroupForm = () => {
    const axiosPrivate = useAxiosPrivate();

    const [responseMessage, setResponseMessage] = React.useState('');
    const [form, setForm] = React.useState({
        group: '',
        notes: '',
      });
    
      const handleChange = (event) => {
        setForm({
          ...form,
          [event.target.id]: event.target.value,
        });
      };

      const handleSubmit = async (e) => {
        e.preventDefault();
        setResponseMessage("");
        try {
            const { group, notes } = form;
            const response = await axiosPrivate.post('/add_stuff_group', JSON.stringify({group, notes}), {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true   
            });
            console.log(JSON.stringify(response?.data));
            const message = response?.data?.message;
            setResponseMessage(message);
            setForm({group: '', notes: ''});
            //navigate(from, {replace: true });   
            } catch (err) {
            console.log("ERROR FOUND");
            console.log(err.message);
            if (!err?.response) {
                setResponseMessage("No Server Response");
                console.log("NO RESPONSE");
            } else  {
                setResponseMessage("Unauthorized");
                console.log("UNAUTHORIZED");
            }
        }


          
      };

  return (
    <div>
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="group">Group Name</label><br />
        <input
          style ={{'width': '300px'}}
          id="group"
          type="text"
          value={form.group}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="notes">Notes</label><br />
        <textarea style={{'width': '300px', 'height': '80px'}}
          id="notes"
          value={form.notes}
          onChange={handleChange}
        />

      </div>
      <button type="submit">Add Group</button>
    </form>
    <p>{responseMessage}</p>
    </div>
  );
};

export { AddStuffGroupForm };