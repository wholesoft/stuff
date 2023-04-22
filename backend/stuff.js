import mysql from "mysql2"
import dotenv from "dotenv"
import joi from "joi"

dotenv.config()

const pool = mysql
  .createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  })
  .promise()

export async function addStuffGroup(props) {
  // Returns { 'success': true/false , 'message': '' }
  let success = false
  let message = ""
  let validation_okay = true

  // VALIDATE INPUT
  const schema = joi.object({
    user_id: joi.number().integer().required(),
    group_name: joi.string().required(),
    notes: joi.string().allow(""),
  })

  const { error, value } = schema.validate(props)
  if (error) {
    console.log(error)
    console.log("Validation Error.")
    message = "Vaidation Error (" + error.details[0].message + ")"
    validation_okay = false
    return { success: false, message: message }
  }

  // Add the Group
  if (validation_okay) {
    const result = await pool.query(
      `
       INSERT INTO Stuff_Groups (user_id, group_name, notes, created, updated) VALUES (?,?,?,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)
       `,
      [props.user_id, props.group_name, props.notes]
    )
    console.log(result)
    success = true
    message = `Group Added (${props.group}).`
  }

  return { success: success, message: message }
}

export async function editStuffGroup(props) {
  // Returns { 'success': true/false , 'message': '' }
  let success = false
  let message = ""
  let validation_okay = true

  // VALIDATE INPUT
  const schema = joi.object({
    user_id: joi.number().integer().required(),
    group_id: joi.number().integer().required(),
    group_name: joi.string().required(),
    notes: joi.string().allow(""),
  })

  const { error, value } = schema.validate(props)
  if (error) {
    console.log(error)
    console.log("Validation Error.")
    message = "Vaidation Error (" + error.details[0].message + ")"
    validation_okay = false
    return { success: false, message: message }
  }

  // Update the Group
  if (validation_okay) {
    const result = await pool.query(
      `
       UPDATE Stuff_Groups SET group_name=?, notes=?, updated=CURRENT_TIMESTAMP
       WHERE id=? AND user_id=?
       `,
      [props.group_name, props.notes, props.group_id, props.user_id]
    )
    console.log(result)
    success = true
    message = `Group Updated.`
  }

  return { success: success, message: message, group_id: props.group_id }
}

export async function deleteStuffGroup(props) {
  // Returns { 'success': true/false , 'message': '' }
  // Only allow if the group has no items in it.
  let success = false
  let message = ""
  let validation_okay = true

  // VALIDATE INPUT
  const schema = joi.object({
    user_id: joi.number().integer().required(),
    group_id: joi.number().integer().required(),
  })

  const { error, value } = schema.validate(props)
  if (error) {
    console.log(error)
    console.log("Validation Error.")
    message = "Vaidation Error (" + error.details[0].message + ")"
    validation_okay = false
    return { success: false, message: message }
  }

  // Make sure the group is empty
  let stuff = await getStuff(props)
  console.log(stuff.data)
  if (stuff.data.length > 0) {
    message =
      "Error.  Group items must be deleted before the group can be deleted."
    validation_okay = false
    return { success: false, message: message }
  }

  // Delete the group
  if (validation_okay) {
    const result = await pool.query(
      `
       DELETE FROM Stuff_Groups WHERE id=? AND user_id=?
       `,
      [props.group_id, props.user_id]
    )
    console.log(result)
    success = true
    message = `Group Deleted (${props.group_id}).`
  }

  return { success: success, message: message }
}

export async function getStuffGroups(props) {
  // Returns { 'success': true/false , 'message': '', 'data': [] }
  let success = false
  let message = ""
  let validation_okay = true

  // VALIDATE INPUT
  const schema = joi.object({
    user_id: joi.number().integer().required(),
  })

  const { error, value } = schema.validate(props)
  if (error) {
    console.log(error)
    console.log("Validation Error.")
    message = "Vaidation Error (" + error.details[0].message + ")"
    validation_okay = false
    return { success: false, message: message, data: [] }
  }
  const [rows] = await pool.query(
    `
    SELECT a.id, a.group_name, a.notes, a.created, a.updated, count(b.id) as total_items
    FROM Stuff_Groups a
    LEFT JOIN Stuff b ON a.id=b.group_id
    WHERE a.user_id=?
    GROUP BY  a.id, a.group_name, a.notes, a.created, a.updated
    ORDER BY a.id DESC
    `,
    [props.user_id]
  )

  return { success: true, message: "OK", data: rows }
}

export async function getStuffGroup(props) {
  // Returns { 'success': true/false , 'message': '', 'data': [] }
  let success = false
  let message = ""
  let validation_okay = true

  // VALIDATE INPUT
  const schema = joi.object({
    user_id: joi.number().integer().required(),
    group_id: joi.number().integer().required(),
  })

  const { error, value } = schema.validate(props)
  if (error) {
    console.log(error)
    console.log("Validation Error.")
    message = "Vaidation Error (" + error.details[0].message + ")"
    //console.log(message)
    validation_okay = false
    return { success: false, message: message, data: [] }
  }
  const [rows] = await pool.query(
    `
    SELECT id, group_name, notes, created, updated FROM Stuff_Groups WHERE user_id=? AND id=?
    `,
    [props.user_id, props.group_id]
  )
  if (rows.length == 0) {
    return { success: false, message: "Error, Group Not Found.", data: [] }

    // can't do this here: ReferenceError: res is not defined
    //res.sendStatus(404) // Not Found.  The group may or may not exist, but not for this user.
  }
  return { success: true, message: "OK", data: rows }
}

export async function addStuffItem(props) {
  // Returns { 'success': true/false , 'message': '' }
  let success = false
  let message = ""
  let validation_okay = true
  let item_id = 0

  // VALIDATE INPUT
  const schema = joi.object({
    user_id: joi.number().integer().required(),
    group_id: joi.number().integer().required(),
    item_name: joi.string().allow(""),
    purchase_location: joi.string().allow(""),
    purchase_date: joi.date().allow(null).empty("").default(null),
    amount_paid: joi.number().empty("").default(null),
    notes: joi.string().allow(""),
  })

  const { error, value } = schema.validate(props)

  let amount_paid = props.amount_paid
  if (amount_paid == "") {
    amount_paid = null
  }
  let purchase_date = props.purchase_date
  if (purchase_date == "") {
    purchase_date = null
  }
  if (purchase_date != null) {
    purchase_date = purchase_date.substring(0, 10)
  }

  if (error) {
    console.log(error)
    console.log("Validation Error.")
    message = "Vaidation Error (" + error.details[0].message + ")"
    validation_okay = false
    return { success: false, message: message }
  }

  // Add the Stuff Item
  if (validation_okay) {
    const result = await pool.query(
      `
       INSERT INTO Stuff (user_id, group_id, item_name, notes, purchased_location, date_purchased, amount_paid, created, updated) 
       VALUES (?,?,?,?,?,?,?,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)
       `,
      [
        props.user_id,
        props.group_id,
        props.item_name,
        props.notes,
        props.purchase_location,
        purchase_date,
        amount_paid,
      ]
    )
    console.log(result)
    item_id = result[0].insertId

    success = true
    message = `Item Added (${props.item_name}).`
  }

  return {
    success: success,
    message: message,
    item_id: item_id,
    group_id: props.group_id,
  }
}

export async function editStuffItem(props) {
  // Returns { 'success': true/false , 'message': '' }
  let success = false
  let message = ""
  let validation_okay = true

  // VALIDATE INPUT
  const schema = joi.object({
    user_id: joi.number().integer().required(),
    item_id: joi.number().integer().required(),
    group_id: joi.number().integer(),
    item_name: joi.string().required(),
    purchase_location: joi.string().allow(""),
    purchase_date: joi.date().allow(null).empty("").default(null),
    amount_paid: joi.number().empty("").default(null),
    notes: joi.string().allow(""),
  })

  const { error, value } = schema.validate(props)

  let amount_paid = props.amount_paid
  if (amount_paid == "") {
    amount_paid = null
  }
  let purchase_date = props.purchase_date
  if (purchase_date != null) {
    purchase_date = purchase_date.substring(0, 10)
  }

  if (error) {
    console.log(error)
    console.log("Validation Error.")
    message = "Vaidation Error (" + error.details[0].message + ")"
    validation_okay = false
    return { success: false, message: message }
  }

  // Add the Stuff Item
  if (validation_okay) {
    const result = await pool.query(
      `
       UPDATE Stuff SET item_name=?, notes=?, purchased_location=?, date_purchased=?, amount_paid=?, updated=CURRENT_TIMESTAMP 
       WHERE id=? AND user_id=?
       `,
      [
        props.item_name,
        props.notes,
        props.purchase_location,
        purchase_date,
        amount_paid,
        props.item_id,
        props.user_id,
      ]
    )
    console.log(result)
    success = true
    message = `Item Updated (${props.item_name}).`
  }
  let item_id = props.item_id
  let group_id = props.group_id
  return { success, message, item_id, group_id }
}

export async function deleteStuffItem(props) {
  // Returns { 'success': true/false , 'message': '' }
  let success = false
  let message = ""
  let validation_okay = true

  // VALIDATE INPUT
  const schema = joi.object({
    user_id: joi.number().integer().required(),
    item_id: joi.number().integer().required(),
  })

  const { error, value } = schema.validate(props)

  if (error) {
    console.log(error)
    console.log("Validation Error.")
    message = "Vaidation Error (" + error.details[0].message + ")"
    validation_okay = false
    return { success: false, message: message }
  }

  // Delete the Stuff Item
  if (validation_okay) {
    const result = await pool.query(
      `
       DELETE FROM Stuff WHERE id=? AND user_id=?
       `,
      [props.item_id, props.user_id]
    )
    console.log(result)
    success = true
    message = `Item Deleted (${props.item_id}).`
  }

  return { success: success, message: message }
}

export async function getStuff(props) {
  // Returns { 'success': true/false , 'message': '', 'data': [] }
  let success = false
  let message = ""
  let validation_okay = true

  // VALIDATE INPUT
  const schema = joi.object({
    user_id: joi.number().integer().required(),
    group_id: joi.number().integer().required(),
  })

  const { error, value } = schema.validate(props)
  if (error) {
    console.log(error)
    console.log("Validation Error.")
    message = "Vaidation Error (" + error.details[0].message + ")"
    validation_okay = false
    return { success: false, message: message, data: [] }
  }
  const [rows] = await pool.query(
    `
    SELECT id, user_id, group_id, item_name, notes, purchased_location, date_purchased, amount_paid, image, created, updated
     FROM Stuff WHERE user_id=? AND group_id=? ORDER BY id DESC
    `,
    [props.user_id, props.group_id]
  )

  return { success: true, message: "OK", data: rows }
}

export async function getStuffItem(props) {
  // Returns { 'success': true/false , 'message': '', 'data': [] }
  let success = false
  let message = ""
  let validation_okay = true

  // VALIDATE INPUT
  const schema = joi.object({
    user_id: joi.number().integer().required(),
    item_id: joi.number().integer().required(),
  })

  const { error, value } = schema.validate(props)
  if (error) {
    console.log(error)
    console.log("Validation Error.")
    message = "Vaidation Error (" + error.details[0].message + ")"
    validation_okay = false
    return { success: false, message: message, data: [] }
  }
  const [rows] = await pool.query(
    `
  SELECT id, user_id, group_id, item_name, notes, purchased_location, image, date_purchased, amount_paid, created, updated
   FROM Stuff WHERE user_id=? AND id=?
  `,
    [props.user_id, props.item_id]
  )

  console.log(rows)
  return { success: true, message: "OK", data: rows }
}

export async function editStuffGroupName(props) {
  // Returns { 'success': true/false , 'message': '' }
  let success = false
  let message = ""
  let validation_okay = true

  // VALIDATE INPUT
  const schema = joi.object({
    user_id: joi.number().integer().required(),
    group_id: joi.number().integer().required(),
    group_name: joi.string().required(),
  })

  const { error, value } = schema.validate(props)

  if (error) {
    console.log(error)
    console.log("Validation Error.")
    message = "Vaidation Error (" + error.details[0].message + ")"
    validation_okay = false
    return { success: false, message: message }
  }

  // UPDATE RECORD
  if (validation_okay) {
    const result = await pool.query(
      `
       UPDATE Stuff_Groups SET group_name=?, updated=CURRENT_TIMESTAMP WHERE id=? AND user_id=?
       `,
      [props.group_name, props.group_id, props.user_id]
    )
    console.log(result)
    success = true
    message = `Group Updated (${props.group_name}).`
  }

  return { success: success, message: message }
}

export async function editStuffGroupNote(props) {
  // Returns { 'success': true/false , 'message': '' }
  let success = false
  let message = ""
  let validation_okay = true

  // VALIDATE INPUT
  const schema = joi.object({
    user_id: joi.number().integer().required(),
    group_id: joi.number().integer().required(),
    note: joi.string().allow(""),
  })

  const { error, value } = schema.validate(props)

  if (error) {
    console.log(error)
    console.log("Validation Error.")
    message = "Vaidation Error (" + error.details[0].message + ")"
    validation_okay = false
    return { success: false, message: message }
  }

  // UPDATE RECORD
  if (validation_okay) {
    const result = await pool.query(
      `
       UPDATE Stuff_Groups SET notes=?, updated=CURRENT_TIMESTAMP WHERE id=? AND user_id=?
       `,
      [props.note, props.group_id, props.user_id]
    )
    console.log(result)
    success = true
    message = `Group Updated (${props.group_name}).`
  }

  return { success: success, message: message }
}

export async function editItemName(props) {
  // Returns { 'success': true/false , 'message': '' }
  let success = false
  let message = ""
  let validation_okay = true

  // VALIDATE INPUT
  const schema = joi.object({
    user_id: joi.number().integer().required(),
    item_id: joi.number().integer().required(),
    item_name: joi.string().required(),
  })

  const { error, value } = schema.validate(props)

  if (error) {
    console.log(error)
    console.log("Validation Error.")
    message = "Vaidation Error (" + error.details[0].message + ")"
    validation_okay = false
    return { success: false, message: message }
  }

  // UPDATE RECORD
  if (validation_okay) {
    const result = await pool.query(
      `
       UPDATE Stuff SET item_name=?, updated=CURRENT_TIMESTAMP WHERE id=? AND user_id=?
       `,
      [props.item_name, props.item_id, props.user_id]
    )
    console.log(result)
    success = true
    message = `Item Updated (${props.item_name}).`
  }

  return { success: success, message: message }
}

export async function editItemNote(props) {
  // Returns { 'success': true/false , 'message': '' }
  let success = false
  let message = ""
  let validation_okay = true

  // VALIDATE INPUT
  const schema = joi.object({
    user_id: joi.number().integer().required(),
    item_id: joi.number().integer().required(),
    note: joi.string().allow(""),
  })

  const { error, value } = schema.validate(props)

  if (error) {
    console.log(error)
    console.log("Validation Error.")
    message = "Vaidation Error (" + error.details[0].message + ")"
    validation_okay = false
    return { success: false, message: message }
  }

  // UPDATE RECORD
  if (validation_okay) {
    const result = await pool.query(
      `
       UPDATE Stuff SET notes=?, updated=CURRENT_TIMESTAMP WHERE id=? AND user_id=?
       `,
      [props.note, props.item_id, props.user_id]
    )
    console.log(result)
    success = true
    message = `Note Updated (${props.item_name}).`
  }

  return { success: success, message: message }
}

export async function editItemPurchasedLocation(props) {
  // Returns { 'success': true/false , 'message': '' }
  let success = false
  let message = ""
  let validation_okay = true

  // VALIDATE INPUT
  const schema = joi.object({
    user_id: joi.number().integer().required(),
    item_id: joi.number().integer().required(),
    purchased_location: joi.string().allow(""),
  })

  const { error, value } = schema.validate(props)

  if (error) {
    console.log(error)
    console.log("Validation Error.")
    message = "Vaidation Error (" + error.details[0].message + ")"
    validation_okay = false
    return { success: false, message: message }
  }

  // UPDATE RECORD
  if (validation_okay) {
    const result = await pool.query(
      `
       UPDATE Stuff SET purchased_location=?, updated=CURRENT_TIMESTAMP WHERE id=? AND user_id=?
       `,
      [props.purchased_location, props.item_id, props.user_id]
    )
    console.log(result)
    success = true
    message = `Purchased Location Updated (${props.purchased_location}).`
  }

  return { success: success, message: message }
}

export async function editItemPurchasedDate(props) {
  // Returns { 'success': true/false , 'message': '' }
  let success = false
  let message = ""
  let validation_okay = true

  // VALIDATE INPUT
  const schema = joi.object({
    user_id: joi.number().integer().required(),
    item_id: joi.number().integer().required(),
    purchase_date: joi.date().allow(null).empty("").default(null),
  })

  const { error, value } = schema.validate(props)

  let purchase_date = props.purchase_date
  if (purchase_date != null) {
    purchase_date = purchase_date.substring(0, 10)
  }

  if (error) {
    console.log(error)
    console.log("Validation Error.")
    message = "Vaidation Error (" + error.details[0].message + ")"
    validation_okay = false
    return { success: false, message: message }
  }

  // UPDATE RECORD
  if (validation_okay) {
    const result = await pool.query(
      `
       UPDATE Stuff SET date_purchased=?, updated=CURRENT_TIMESTAMP WHERE id=? AND user_id=?
       `,
      [purchase_date, props.item_id, props.user_id]
    )
    console.log(result)
    success = true
    message = `Purchased Date Updated (${purchase_date}).`
  }

  return { success: success, message: message }
}

export async function editItemCost(props) {
  // Returns { 'success': true/false , 'message': '' }
  let success = false
  let message = ""
  let validation_okay = true

  // VALIDATE INPUT
  const schema = joi.object({
    user_id: joi.number().integer().required(),
    item_id: joi.number().integer().required(),
    amount_paid: joi.number().empty("").default(null),
  })

  const { error, value } = schema.validate(props)

  let amount_paid = props.amount_paid
  if (amount_paid == "") {
    amount_paid = null
  }

  if (error) {
    console.log(error)
    console.log("Validation Error.")
    message = "Vaidation Error (" + error.details[0].message + ")"
    validation_okay = false
    return { success: false, message: message }
  }

  // UPDATE RECORD
  if (validation_okay) {
    const result = await pool.query(
      `
       UPDATE Stuff SET amount_paid=?, updated=CURRENT_TIMESTAMP WHERE id=? AND user_id=?
       `,
      [amount_paid, props.item_id, props.user_id]
    )
    console.log(result)
    success = true
    message = `Cost Updated (${props.amount_paid}).`
  }

  return { success: success, message: message }
}

export async function editItemImage(props) {
  // Returns { 'success': true/false , 'message': '' }
  let success = false
  let message = ""
  let validation_okay = true

  // VALIDATE INPUT
  const schema = joi.object({
    user_id: joi.number().integer().required(),
    item_id: joi.number().integer().required(),
    group_id: joi.number().integer().required(),
    image: joi.string().required(),
  })

  const { error, value } = schema.validate(props)
  let { item_id, group_id } = props

  if (error) {
    console.log(error)
    console.log("Validation Error.")
    message = "Vaidation Error (" + error.details[0].message + ")"
    validation_okay = false
    return { success: false, message: message }
  }

  if (props.item_id == 0) {
    const response = await addStuffItem({
      user_id: props.user_id,
      group_id: props.group_id,
      item_name: "",
      purchase_location: "",
      purchase_date: null,
      amount_paid: "",
      notes: "",
    })
    console.log("Adding New Item from Image")
    console.log(response)
    item_id = response.item_id
    group_id = response.group_id
  }

  // UPDATE RECORD
  if (validation_okay) {
    const result = await pool.query(
      `
       UPDATE Stuff SET image=?, updated=CURRENT_TIMESTAMP WHERE id=? AND user_id=?
       `,
      [props.image, item_id, props.user_id]
    )
    console.log(result)
    success = true
    message = `Image Updated (${props.image}).`
  }

  return {
    success: success,
    message: message,
    image: props.image,
    item_id,
    group_id,
  }
}

/*

CREATE TABLE Stuff (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    group_id INT,
    item_name VARCHAR(255) NOT NULL,
    purchased_location VARCHAR(255),
    image VARCHAR(255),
    date_purchased DATETIME,
    amount_paid DECIMAL(10, 2),
    created DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated DATETIME DEFAULT CURRENT_TIMESTAMP,
    notes TEXT
);

CREATE TABLE Stuff_Groups (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    group_name VARCHAR(255) NOT NULL,
    notes TEXT,
    created DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated DATETIME DEFAULT CURRENT_TIMESTAMP
);
*/
