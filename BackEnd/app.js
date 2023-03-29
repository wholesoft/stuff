import express from 'express'
import cors from 'cors'
import { getNotes, getNote, createNote } from './test/database.js'
import { create_user, confirm_email, login_user, getUsers, getUser, reset_password,  get_user_id_from_password_token,
  send_email_confirmation_request, update_email_address, update_password, delete_user,update_user_roles } from './user.js'
import { addStuffGroup, getStuffGroups, addStuffItem, getStuff, getStuffItem,
  editStuffGroup, deleteStuffGroup, editStuffItem, deleteStuffItem, editStuffGroupName, editStuffGroupNote } from './stuff.js'
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
  const { refresh_token, access_token, success, roles, email_confirmed } = await login_user(req.body)
  console.log("Roles: " + roles);
  //let response = { success: success }
  if (success == true)
  {
    res.cookie('jwt', refresh_token, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000})
    res.json({ success: success, access_token: access_token, roles: roles, email_confirmed: email_confirmed })
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

app.post('/resend_email_confirmation_request', async (req, res) => {
  const {email} = req.body;
  const result = await send_email_confirmation_request(email);
  res.send(result);
});

app.post('/reset_password_email_request', async (req, res) => {
  const {email} = req.body;
  const result = await reset_password(email);
  res.send(result);
});

app.post('/update_password_with_token', async (req, res) => {
  console.log("POST: update_password_with_token");
  console.log(JSON.stringify(req.body));
  const { password, confirm_password, password_reset_token } = req.body;
  // GET THE USER_ID WITH THE TOKEN
  let result = "";
  const user_id = await get_user_id_from_password_token(password_reset_token);
  if (user_id > 0) {
    result = await update_password({ user_id, password, confirm_password });
  }
  else {
    result = res.send({"success": false, "message": "invalid token" })
  }
  res.send(result);
});

 

app.use(verifyJWT);
/*
   Middleware verifies/decodes auth token and inserts values into the request handler:
   jwt_user_id
   jwt_roles 
*/


app.get('/users/:id', async (req, res) => {  
  const id = req.params.id
  const user = await getUser(id)
  res.send(user);
});

// TODO: LIMIT PERMISSIONS ONLY TO THINGS THE USER HAS ACCESS TO
// REGULAR USERS SHOULD ONLY BE ABLE TO ACCESS THEIR OWN INFO
// ADMIN USERS CAN ACCESS ANYTHING

app.get('/stuff/:group_id', async (req, res) => {
    console.log("GET: /stuff");
    const group_id = req.params.group_id
    //console.log(JSON.stringify(req.body));
    //const { group_id } = req.body;
    const stuff = await getStuff({ 'user_id': req.jwt_user_id, 'group_id': group_id })
    res.send(stuff.data);
});

app.get('/item/:item_id', async (req, res) => {
  console.log("GET: /item");
  const item_id = req.params.item_id
  //console.log(JSON.stringify(req.body));
  //const { group_id } = req.body;
  const item = await getStuffItem({ 'user_id': req.jwt_user_id, 'item_id': item_id })
  res.send(item.data);
});

app.get('/stuff_groups', async (req, res) => {
  console.log("GET: /stuff_groups");
  const groups = await getStuffGroups({ 'user_id': req.jwt_user_id })
  res.send(groups.data);
});

app.post('/add_stuff_group', async (req, res) => {
  console.log("POST: /add_stuff_group");
  console.log(JSON.stringify(req.body));
  const { group, notes } = req.body;
  const result = await addStuffGroup({ 'user_id': req.jwt_user_id, 'group': group, 'notes': notes });
  res.send(result);
});

app.post('/edit_stuff_group', async (req, res) => {
  console.log("POST: /edit_stuff_group");
  console.log(JSON.stringify(req.body));
  const { group_id, group, notes } = req.body;
  const result = await editStuffGroup({ 'user_id': req.jwt_user_id, group, notes, group_id });
  res.send(result);
});

app.post('/edit_stuff_group_name', async (req, res) => {
  console.log("POST: /edit_stuff_group_name");
  console.log(JSON.stringify(req.body));
  const { group_id, group_name } = req.body;
  const result = await editStuffGroupName({ 'user_id': req.jwt_user_id, group_name, group_id });
  res.send(result);
});

app.post('/edit_stuff_group_note', async (req, res) => {
  console.log("POST: /edit_stuff_group_note");
  console.log(JSON.stringify(req.body));
  const { group_id, note } = req.body;
  const result = await editStuffGroupNote({ 'user_id': req.jwt_user_id, note, group_id });
  res.send(result);
});

app.get('/delete_group/:group_id', async (req, res) => {
  console.log("GET: /delete_stuff_group");
  const  group_id  = req.params.group_id
  const result = await deleteStuffGroup({ 'user_id': req.jwt_user_id, group_id });
  res.send(result);
});

app.post('/add_stuff_item', async (req, res) => {
  console.log("POST: /add_stuff_item");
  const { group_id , item_name, purchase_location, purchase_date, amount_paid, notes } = req.body;
  console.log(JSON.stringify(req.body));
  const result = await addStuffItem({ 'user_id': req.jwt_user_id, 'group_id': group_id,
  'item_name': item_name, 'purchase_location': purchase_location, 'purchase_date': purchase_date, 
  'amount_paid': amount_paid, 'notes': notes });
  res.send(result);
});

app.post('/edit_stuff_item', async (req, res) => {
  console.log("POST: /edit_stuff_item");
  const { item_id , item_name, purchase_location, purchase_date, amount_paid, notes } = req.body;
  console.log(JSON.stringify(req.body));
  const result = await editStuffItem({ 'user_id': req.jwt_user_id, 'item_id': item_id,
  'item_name': item_name, 'purchase_location': purchase_location, 'purchase_date': purchase_date, 
  'amount_paid': amount_paid, 'notes': notes });
  res.send(result);
});

app.get('/delete_item/:item_id', async (req, res) => {
  console.log("GET: /delete_item");
  const  item_id  = req.params.item_id
  console.log(JSON.stringify(req.body));
  const result = await deleteStuffItem({ 'user_id': req.jwt_user_id, 'item_id': item_id })
  res.send(result);
});

app.get('/users', async (req, res) => {
  console.log(`Verified ${req.jwt_user_id} : ${req.jwt_roles}`);
  const users = await getUsers()
  res.send(users);
}); 

app.get('/delete_user/:user_id', async (req, res) => {
  console.log("GET: /delete_user");
  const  user_id  = req.params.user_id
  console.log(JSON.stringify(req.body));
  // MUST BE AN ADMIN (role=2001) TO DO THIS
  const roles = req.jwt_roles;
  console.log(roles);
  let is_admin = false;
  if (roles == 2001) {
    is_admin = true;
  }

  //const result = await delete_user({ 'user_id': user_id, 'item_id': item_id })
  res.send({"admin": is_admin});
});

app.post('/update_email_address', async (req, res) => {
  console.log("POST: update_email_address");
  console.log(JSON.stringify(req.body));
  const { email} = req.body;
  const user_id = req.jwt_user_id;
  const result = await update_email_address({ 'user_id': req.jwt_user_id, 'email': email });
  res.send(result);
});

app.post('/update_password', async (req, res) => {
  console.log("POST: update_password");
  console.log(JSON.stringify(req.body));
  const { password, confirm_password } = req.body;
  const user_id = req.jwt_user_id;
  const result = await update_password({ user_id, password, confirm_password });
  res.send(result);
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
