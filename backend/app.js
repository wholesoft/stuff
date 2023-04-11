import express from "express"
import cors from "cors"
import multer from "multer"
import fs from "fs"
import UserAgent from "user-agents"

import {
  create_user,
  confirm_email,
  login_user,
  getUsers,
  getUser,
  reset_password,
  get_user_id_from_password_token,
  send_email_confirmation_request,
  update_email_address,
  update_password,
  delete_user,
  update_user_roles,
} from "./user.js"
import {
  addStuffGroup,
  getStuffGroups,
  getStuffGroup,
  addStuffItem,
  getStuff,
  getStuffItem,
  editStuffGroup,
  deleteStuffGroup,
  editStuffItem,
  deleteStuffItem,
  editStuffGroupName,
  editStuffGroupNote,
  editItemName,
  editItemNote,
  editItemPurchasedLocation,
  editItemPurchasedDate,
  editItemCost,
  editItemImage,
} from "./stuff.js"
import { verifyJWT } from "./middleware/verifyJWT.js"
import cookieParser from "cookie-parser"
import refresh_route from "./routes/refresh.js"
import logout_route from "./routes/logout.js"
import credentials from "./middleware/credentials.js"
import corsOptions from "./config/corsOptions.js"

const is_admin = (roles) => {
  let result = false
  if (roles.includes(2001)) {
    result = true
  }
  return result
}

const upload = multer({ dest: "images/" })

const app = express()

app.use(credentials)

app.use(cors(corsOptions))

app.use(express.json())

// middleware for cookies
app.use(cookieParser())

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.send("Something broke!")
})

// trust proxy should mean req.ip returns the client ip address and not the proxy ip address
// doesn't work: ::ffff:127.0.0.1
// TODO, get the ipaddress another way
app.set("trust proxy", true)

const clientUserAgent = new UserAgent()
let userAgentString = truncate(clientUserAgent.toString(), 250) // get user-agent.  truncate if too long.
let clientDetails = JSON.stringify(clientUserAgent.data, null, 2)

//app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.send(process.env.APP_SHORT_DOMAIN)
})

app.get("/auth", async (req, res) => {
  //const { email, password } = req.body;
  //console.log(req.body)
  //const result = await login_user(req.body)
  let response = { success: false }
  res.send(response)
})

app.use("/refresh", refresh_route)

app.use("/logout", logout_route)

app.post("/auth", async (req, res) => {
  const { email, password } = req.body
  console.log(req.body)
  const {
    refresh_token,
    access_token,
    success,
    roles,
    email_confirmed,
    user_id,
  } = await login_user(req.body, req.ip, userAgentString, clientDetails)
  console.log("Roles: " + roles)
  //let response = { success: success }
  if (success == true) {
    res.cookie("jwt", refresh_token, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    })
    res.json({
      success: success,
      access_token: access_token,
      roles: roles,
      email_confirmed: email_confirmed,
      user_id,
      user_id,
    })
  } else {
    console.log("Sending 401 Error")
    res.sendStatus(401)
  }
})

app.post("/register", async (req, res) => {
  const { email, password, confirm_password } = req.body
  const result = await create_user(req.body)
  res.send(result)
})

app.get("/confirm/:key", async (req, res) => {
  const key = req.params.key
  const result = await confirm_email(key)
  res.send(result)
})

app.post("/resend_email_confirmation_request", async (req, res) => {
  const { email } = req.body
  const result = await send_email_confirmation_request(email)
  res.send(result)
})

app.post("/reset_password_email_request", async (req, res) => {
  const { email } = req.body
  const result = await reset_password(email)
  res.send(result)
})

app.post("/update_password_with_token", async (req, res) => {
  console.log("POST: update_password_with_token")
  console.log(JSON.stringify(req.body))
  const { password, confirm_password, password_reset_token } = req.body
  // GET THE USER_ID WITH THE TOKEN
  let result = ""
  const user_id = await get_user_id_from_password_token(password_reset_token)
  if (user_id > 0) {
    result = await update_password({ user_id, password, confirm_password })
  } else {
    result = res.send({ success: false, message: "invalid token" })
  }
  res.send(result)
})

app.get("/images/:imageName", (req, res) => {
  console.log("GET: /images:imageName")
  const imageName = req.params.imageName
  if (imageName != null) {
    const readStream = fs.createReadStream(`images/${imageName}`)
    readStream.pipe(res)
  } else {
    res.send("Invalid Image.")
  }
})

app.use(verifyJWT)
/*
   Middleware verifies/decodes auth token and inserts values into the request handler:
   jwt_user_id
   jwt_roles 
*/

// TODO: LIMIT PERMISSIONS ONLY TO THINGS THE USER HAS ACCESS TO
// REGULAR USERS SHOULD ONLY BE ABLE TO ACCESS THEIR OWN INFO
// ADMIN USERS CAN ACCESS ANYTHING

app.get("/stuff/:group_id", async (req, res) => {
  console.log("GET: /stuff")
  const group_id = req.params.group_id
  //console.log(JSON.stringify(req.body));
  //const { group_id } = req.body;
  const stuff = await getStuff({ user_id: req.jwt_user_id, group_id: group_id })
  res.send(stuff.data)
})

app.get("/item/:item_id", async (req, res) => {
  console.log("GET: /item")
  const item_id = req.params.item_id
  //console.log(JSON.stringify(req.body));
  //const { group_id } = req.body;
  const item = await getStuffItem({
    user_id: req.jwt_user_id,
    item_id: item_id,
  })
  res.send(item.data)
})

app.get("/groups", async (req, res) => {
  console.log("GET: /stuff_groups")
  const groups = await getStuffGroups({ user_id: req.jwt_user_id })
  res.send(groups.data)
})

app.get("/group/:group_id", async (req, res) => {
  console.log("GET: /group/:group_id")
  console.log("XXX")
  const group_id = req.params.group_id
  console.log(group_id)
  const groups = await getStuffGroup({ user_id: req.jwt_user_id, group_id })
  console.log(groups)
  res.send(groups.data)
})

app.post("/add_stuff_group", async (req, res) => {
  console.log("POST: /add_stuff_group")
  console.log(JSON.stringify(req.body))
  const { group_name, notes } = req.body
  const result = await addStuffGroup({
    user_id: req.jwt_user_id,
    group_name: group_name,
    notes: notes,
  })
  res.send(result)
})

app.post("/edit_stuff_group", async (req, res) => {
  console.log("POST: /edit_stuff_group")
  console.log(JSON.stringify(req.body))
  const { group_id, group_name, notes } = req.body
  const result = await editStuffGroup({
    user_id: req.jwt_user_id,
    group_name,
    notes,
    group_id,
  })
  res.send(result)
})

app.post("/edit_stuff_group_name", async (req, res) => {
  console.log("POST: /edit_stuff_group_name")
  console.log(JSON.stringify(req.body))
  const { group_id, group_name } = req.body
  const result = await editStuffGroupName({
    user_id: req.jwt_user_id,
    group_name,
    group_id,
  })
  res.send(result)
})

app.post("/edit_stuff_group_note", async (req, res) => {
  console.log("POST: /edit_stuff_group_note")
  console.log(JSON.stringify(req.body))
  const { group_id, note } = req.body
  const result = await editStuffGroupNote({
    user_id: req.jwt_user_id,
    note,
    group_id,
  })
  res.send(result)
})

app.get("/delete_group/:group_id", async (req, res) => {
  console.log("GET: /delete_stuff_group")
  const group_id = req.params.group_id
  const result = await deleteStuffGroup({ user_id: req.jwt_user_id, group_id })
  res.send(result)
})

app.post("/add_item", async (req, res) => {
  console.log("POST: /add_item")
  const {
    group_id,
    item_name,
    purchase_location,
    purchase_date,
    amount_paid,
    notes,
  } = req.body
  console.log(JSON.stringify(req.body))
  const result = await addStuffItem({
    user_id: req.jwt_user_id,
    group_id: group_id,
    item_name: item_name,
    purchase_location: purchase_location,
    purchase_date: purchase_date,
    amount_paid: amount_paid,
    notes: notes,
  })
  res.send(result)
})

app.post("/edit_item", async (req, res) => {
  console.log("POST: /edit_item")
  const {
    item_id,
    group_id,
    item_name,
    purchase_location,
    purchase_date,
    amount_paid,
    notes,
  } = req.body
  console.log("EDIT ITEM")
  console.log(JSON.stringify(req.body))
  const result = await editStuffItem({
    user_id: req.jwt_user_id,
    item_id: item_id,
    group_id: group_id,
    item_name: item_name,
    purchase_location: purchase_location,
    purchase_date: purchase_date,
    amount_paid: amount_paid,
    notes: notes,
  })
  res.send(result)
})

app.get("/delete_item/:item_id", async (req, res) => {
  console.log("GET: /delete_item")
  const item_id = req.params.item_id
  console.log(JSON.stringify(req.body))
  const result = await deleteStuffItem({
    user_id: req.jwt_user_id,
    item_id: item_id,
  })
  res.send(result)
})

app.post("/edit_item_cost", async (req, res) => {
  console.log("POST: /edit_item_cost")
  console.log(JSON.stringify(req.body))
  const { item_id, amount_paid } = req.body
  const result = await editItemCost({
    user_id: req.jwt_user_id,
    amount_paid,
    item_id,
  })
  res.send(result)
})

app.post("/edit_item_purchased_date", async (req, res) => {
  console.log("POST: /edit_item_purchased_date")
  console.log(JSON.stringify(req.body))
  const { item_id, purchase_date } = req.body
  const result = await editItemPurchasedDate({
    user_id: req.jwt_user_id,
    purchase_date,
    item_id,
  })
  res.send(result)
})

app.post("/edit_item_purchased_location", async (req, res) => {
  console.log("POST: /edit_item_purchased_location")
  console.log(JSON.stringify(req.body))
  const { item_id, purchased_location } = req.body
  const result = await editItemPurchasedLocation({
    user_id: req.jwt_user_id,
    purchased_location,
    item_id,
  })
  res.send(result)
})

app.post("/edit_item_note", async (req, res) => {
  console.log("POST: /edit_item_note")
  console.log(JSON.stringify(req.body))
  const { item_id, note } = req.body
  const result = await editItemNote({ user_id: req.jwt_user_id, note, item_id })
  res.send(result)
})

app.post("/edit_item_name", async (req, res) => {
  console.log("POST: /edit_item_name")
  console.log(JSON.stringify(req.body))
  const { item_id, item_name } = req.body
  const result = await editItemName({
    user_id: req.jwt_user_id,
    item_name,
    item_id,
  })
  res.send(result)
})

app.post("/edit_item_image", upload.single("image"), async (req, res) => {
  console.log("POST: /edit_item_image")
  //console.log(req)

  // webp files don't work.
  const image = req.file?.filename
  const item_id = req.body.item_id
  console.log(req.body)
  const result = await editItemImage({
    user_id: req.jwt_user_id,
    image,
    item_id,
  })

  res.send(result)
})

/*
JWT BLCOKING IMAGE REQUESTS?
app.get("/images/:imageName", (req, res) => {
  console.log("GET: /images:imageName")

  const imageName = req.params.imageName
  const readStream = fs.createReadStream(`images/${imageName}`)
  readStream.pipe(res)
})
*/

app.get("/users", async (req, res) => {
  console.log(`Verified ${req.jwt_user_id} : ${req.jwt_roles}`)
  const users = await getUsers()
  res.send(users)
})

app.get("/delete_user/:user_id", async (req, res) => {
  console.log("GET: /delete_user")
  const user_id = req.params.user_id
  console.log(JSON.stringify(req.body))

  // MUST BE AN ADMIN TO DO THIS

  app.get("/users/:id", async (req, res) => {
    const id = req.params.id
    let result = { success: false, message: "Not allowed." }
    if (is_admin(req.jwt_roles)) {
      result = await getUser(id)
    }
    res.send(result)
  })

  let result = { success: false, message: "Not allowed." }
  if (is_admin(req.jwt_roles)) {
    console.log("deleting user")
    result = await delete_user({ user_id: user_id })
  }
  res.send(result)
})

app.post("/edit_user_roles", async (req, res) => {
  console.log("POST: /edit_user_roles")
  console.log(JSON.stringify(req.body))
  const { user_id, roles } = req.body
  // MUST BE AN ADMIN TO DO THIS
  let result = { success: false, message: "Not allowed." }
  if (is_admin(req.jwt_roles)) {
    result = await update_user_roles({ user_id: user_id, roles: roles })
  }

  res.send(result)
})

/* 
THIS IS FOR AN ADMIN CHANGING A USER'S EMAIL ADDRESS.  NOT NORMALLY RECOMMENDED. 
*/
app.post("/edit_user_email", async (req, res) => {
  console.log("POST: /edit_user_email")
  console.log(JSON.stringify(req.body))
  const { user_id, email } = req.body
  // MUST BE AN ADMIN TO DO THIS
  let result = { success: false, message: "Not allowed." }
  if (is_admin(req.jwt_roles)) {
    result = await update_email_address({ user_id: user_id, email: email })
  }

  res.send(result)
})

/* THIS IS FOR A USER CHANGING HIS OWN EMAIL ADDRESS */
app.post("/update_email_address", async (req, res) => {
  console.log("POST: update_email_address")
  console.log(JSON.stringify(req.body))
  const { email } = req.body
  const user_id = req.jwt_user_id
  const result = await update_email_address({
    user_id: req.jwt_user_id,
    email: email,
  })
  res.send(result)
})

app.post("/update_password", async (req, res) => {
  console.log("POST: update_password")
  console.log(JSON.stringify(req.body))
  const { password, confirm_password } = req.body
  const user_id = req.jwt_user_id
  const result = await update_password({ user_id, password, confirm_password })
  res.send(result)
})

app.use(express.static("public"))

const port = 3000

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

console.log("backend init")

function truncate(str, length) {
  if (str.length > length) {
    return str.slice(0, length) + "..."
  } else return str
}
