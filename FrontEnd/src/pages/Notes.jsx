import * as React from 'react';
let jsonData  = {}

const Notes = () => {
    
    const [notes, setNotes] = React.useState([]);
    const [page_init, setPageInit] = React.useState(false);
    if (page_init == false)
    {
        setPageInit(true);
fetch('http://127.0.0.1:3000/notes')
  .then(response => response.json())
  .then((jsonData) => {
    console.log(jsonData)
    setNotes(jsonData)
  })
  .catch((error) => {
    console.log("There was an error.")
    console.error(error)
  })
}


return (
      <div>
        <h1>Notes</h1>
        <ul>
        {notes.map((note) =>
            <li>{note.contents}</li>
        )}
        </ul>
      </div>
    )
}
  export { Notes };