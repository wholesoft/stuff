import * as React from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

const AddStuffForm = (props) => {
    const axiosPrivate = useAxiosPrivate();
    const { group_id } = props
    const [purchaseDate, setPurchaseDate] = React.useState(new Date());
    const [responseMessage, setResponseMessage] = React.useState('');
    const [form, setForm] = React.useState({
        item_name: '',
        purchase_location: '',
        purchase_date: '', 
        amount_paid: '',
        notes: ''
      });
    
      const handleChange = (event) => {
        setForm({
          ...form,
          [event.target.id]: event.target.value,
        });
      };

      const handleDateChange = (value) => {
        setPurchaseDate(value)
      };

      const handleSubmit = async (e) => {
        e.preventDefault();
        setResponseMessage("");
        try {
            const { item_name, purchase_location, amount_paid, notes } = form;
            const response = await axiosPrivate.post('/add_stuff_item', 
            JSON.stringify({group_id, item_name, purchase_location, purchase_date: purchaseDate, amount_paid, notes}), {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true   
            });
            console.log(JSON.stringify(response?.data));
            const message = response?.data?.message;
            setResponseMessage(message);
            setForm({group_id: 0, item_name: '', purchase_location: '', purchase_date: '', amount_paid: '', notes: ''});
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
      <p>Group ID:  { group_id }</p>
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
          onChange={handleDateChange}
          dateFormat="yyyy-MM-dd"
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
      <button type="submit">Add Item</button>
    </form>
    <p>{responseMessage}</p>
    </div>
  );
};

export { AddStuffForm };