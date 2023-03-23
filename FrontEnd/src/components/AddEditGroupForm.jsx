import * as React from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

const AddEditGroupForm = (props) => {
    const axiosPrivate = useAxiosPrivate();
    const { data } = props

    let { id, group_name, notes } = data;
    const group_id = id

    const [responseMessage, setResponseMessage] = React.useState('');
    const [form, setForm] = React.useState({
        id: id,
        group: group_name,
        notes: notes,
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
        let response = "";
        const { group, notes } = form;
        try {
            if (group_id > 0)
            {
                response = await axiosPrivate.post('/edit_stuff_group', JSON.stringify({group_id, group, notes}), {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true   
                });
            }
            else
            {
                response = await axiosPrivate.post('/add_stuff_group', JSON.stringify({group, notes}), {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true   
                });
            }
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
      <button type="submit">Save</button>
    </form>
    <p>{responseMessage}</p>
    </div>
  );
};

export { AddEditGroupForm };