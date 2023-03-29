import * as React from 'react';
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { useAddItem } from '../data/stuff/useStuff'

const AddItemForm = (props) => {
  const { data } = props
  const addMutation = useAddItem();

  let { id, item_name, group_id, purchased_location, date_purchased, notes, amount_paid } = data;
  let item_id = id;

  if (group_id == undefined) { group_id = props.groupId }
  //console.log(group_id);

   if (amount_paid == null) { amount_paid = "" }

  let init_state = {
        item_id: item_id,
        group_id: group_id,
        item_name: item_name,
        purchase_location: purchased_location,
        amount_paid: amount_paid,
        notes: notes
      }
    
      const [purchaseDate, setPurchaseDate] = React.useState(new Date());
      const [responseMessage, setResponseMessage] = React.useState('');
      const [form, setForm] = React.useState(init_state);


      const handleChange = (event) => {
        setForm({
          ...form,
          [event.target.id]: event.target.value,
        });
      }

      const handleDateChange = (value) => {
        setPurchaseDate(value)
      };

      const handleSubmit = async (e) => {
        e.preventDefault();
        setResponseMessage("");
        let response = "";
        const { item_name, purchase_location, amount_paid, notes, group_id } = form;
        addMutation.mutate({item_id, group_id, item_name, purchase_location, purchase_date: purchaseDate, amount_paid, notes})
        setForm(init_state);
        console.log("reset form");
      };

  return (
    <div>
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="item_name">Item Name</label><br />
        <input
          style ={{'width': '300px'}}
          id="item_name"
          type="text"
          value={form.item_name}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="purchase_location">Purchase Location</label><br />
        <input
          style ={{'width': '300px'}}
          id="purchase_location"
          type="text"
          value={form.purchase_location}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="purchase_date">Purchase Date</label><br />
        <DatePicker
          selected={purchaseDate}
          id="purchase_date"
          dateFormat="yyyy-MM-dd"
          onChange={(date) => setPurchaseDate(date)}
        />
      </div>

      <div>
        <label htmlFor="amount_paid">Amount Paid</label><br />
        <input
          style ={{'width': '300px'}}
          id="amount_paid"
          type="text"
          value={form.amount_paid}
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

export { AddItemForm };