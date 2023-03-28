import * as React from 'react';
import { useAddItemGroup } from '../data/stuff/useStuff'


const AddGroupForm = (props) => {
    const { data } = props
    const addGroupMutation = useAddItemGroup();

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
        addGroupMutation.mutate({group, notes})
        setForm({group: '', notes: ''});

        }
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

export { AddGroupForm };