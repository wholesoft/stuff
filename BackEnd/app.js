import express from 'express'
import cors from 'cors'
import { getNotes, getNote, createNote } from './test/database.js'
import { create_user } from './user.js'


const app = express()

app.use(cors({
 origin: "http://127.0.0.1:5173", 
}))
app.use(express.json()) 

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.send('Something broke!')
})


//app.set("view engine", "ejs");

app.post("/register", async (req, res) => {
  const { email, password, confirm_password } = req.body;
  const id = await create_user(req.body)
  res.send(id)
});

app.get('/notes', async (req, res) => {
  const notes = await getNotes()
  res.send(notes);
}); 

app.get("/notes/:id", async (req, res) => {
  const id = req.params.id
  const note = await getNote(id)
  res.send(note);
}); 

app.post("/notes", async (req, res) => {
  const { title, contents } = req.body;
  const id = await createNote(title, contents)
  res.send(id)
});

app.get('/', (req, res) => {
  res.send('Hello World!');
  //res.render('index.ejs', {
  //  numberOfIterations: 50
  //});
});

//app.get("/register/:email", (req, res) => {
//   const email = req.params.email;
//   res.send(email);
//});

app.use(express.static("public"))


const port = 3000;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


console.log('backend init');
