import express from 'express'
import cors from 'cors'
import { getNotes, getNote, createNote } from './test/database.js'
import { create_user, confirm_email, login_user, getUsers } from './user.js'
import { verifyJWT } from './middleware/verifyJWT.js';
import cookieParser from 'cookie-parser' ;
import refresh_route from './routes/refresh.js'
import logout_route from './routes/logout.js'
import credentials from './middleware/credentials.js'
import corsOptions from './config/corsOptions.js'

const app = express()

app.use(credentials);

app.use(cors(corsOptions));



app.use(express.json()) 

// middleware for cookies
app.use(cookieParser());

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.send('Something broke!')
})


//app.set("view engine", "ejs");

app.get("/auth", async (req, res) => {
  //const { email, password } = req.body;
  //console.log(req.body)
  //const result = await login_user(req.body)
  let response = { success: false }
  res.send(response)
});

app.use('/refresh', refresh_route);
//app.get('/refresh', async (req, res) => {
//
//})

app.use('/logout', logout_route);


app.post("/auth", async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body)
  const { refresh_token, access_token, success } = await login_user(req.body)
  //let response = { success: success }
  if (success == true)
  {
    res.cookie('jwt', refresh_token, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000})
    res.json({ success: success, access_token: access_token, roles: [1001] })
  }
  else
  {
     console.log("Sending 401 Error");
     res.sendStatus(401);
  }
});

app.post("/register", async (req, res) => {
  const { email, password, confirm_password } = req.body;
  const id = await create_user(req.body)
  let response = { user_id: id }
  if (isNaN(id))
  {
    response = { error: id }
  }
  res.send(response)
});

app.get('/confirm', async (req, res) => {
  const key = req.query.id
  const result = await confirm_email(key)
  res.send(result);
});



app.use(verifyJWT);

app.get('/users', async (req, res) => {
  const users = await getUsers()
  res.send(users);
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



app.use(express.static("public"))


const port = 3000;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


console.log('backend init');
