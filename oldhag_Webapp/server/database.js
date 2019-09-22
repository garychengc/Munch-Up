const db = require("./db/index.js");
const bcrypt = require("bcrypt");

const addUser = function(user) {
  return db
    .query(
      `
  INSERT INTO users (
    name, email, password, phone_number)
    VALUES (
    $1, $2, $3, $4)
    RETURNING *;`,
      [user.name, user.email, user.password, user.phone_number]
    )
    .then(res => res.rows[0]);
};
exports.addUser = addUser;

//Get user info with email
const getUserWithEmail = email => {
  return db
    .query(
      `
  SELECT * FROM users
  WHERE email = $1;
  `,
      [email]
    )
    .then(res => res.rows[0]);
};
exports.getUserWithEmail = getUserWithEmail;

//login
const login = function(email, password) {
  // console.log("hello, testing");
  return getUserWithEmail(email)
    .then(user => {
      // console.log(user);
      if (bcrypt.compareSync(password, user.password)) {
        return user;
      }
      return null;
    })
    .catch(err => console.log(err));
};
exports.login = login;

const addUsersOrderStatuses = function(order) {
  return db
    .query(
      `
    INSERT INTO users_order_statuses (
    order_id, user_order, user_id)
    VALUES (
    $1, $2, $3)
    RETURNING *;`,
      [order.id, order.user_order, order.user_id]
    )
    .then(res => {
      console.log("inside addUserStatus: " ,res.rows);
      res.rows});
};
exports.addUsersOrderStatuses = addUsersOrderStatuses;

const getMenuItems = function(restaurant_id, menu_id) {
  return db
    .query(
      `
      SELECT items.id, items.name, items.description, items.price, restaurants.id as restaurant_id
      FROM items
      JOIN menus ON items.menu_id = menus.id
      JOIN restaurants ON restaurants.id = menus.restaurant_id
      WHERE restaurants.id = $1 AND menus.id = $2;`,
      [restaurant_id, menu_id]
    )
    .then(res => {
      return res.rows;
    })
    .catch(err => console.log(err));
};

exports.getMenuItems = getMenuItems;

const addOrder = function(id, quantity, user_id, restaurant_id, uniqueKey) {
  return db
    .query(
      `INSERT INTO orders (item_id, quantity, user_id, restaurant_id, user_order)
        VALUES ($1,$2,$3,$4,$5 ) RETURNING *;`,
      [id, quantity, user_id, restaurant_id, uniqueKey]
    )
    .then(res => {
      console.log(res.rows);
      addUsersOrderStatuses(res.rows[0]);
      return res.rows;
    });
};
exports.addOrder = addOrder;

const getOrders = function(id) {
  return db
    .query(`SELECT items.name as item_name, restaurants.name as restaurant_name, users_order_statuses.*, orders.*
      FROM orders 
        JOIN users_order_statuses ON (orders.user_order = users_order_statuses.user_order)
        JOIN restaurants ON (orders.restaurant_id = restaurants.id)
        JOIN items ON (items.id = orders.item_id)
      WHERE orders.user_id = $1;
      
      `, [id])
    .then(res => res.rows);
};
exports.getOrders = getOrders;

const generateRandomString = () => {
  let randomString = '';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 6; i++) {
    randomString += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return randomString;
 };
exports.generateRandomString = generateRandomString; 
// const addRestaurantOrderStatuses = function(order) {
//   return db
//     .query(
//       `
//     INSERT INTO restaurant_order_statuses (
//     order_id, user_id , restaurant_id )
//     VALUES (
//     $1, $2, $3)
//     RETURNING *;`,
//       [order.order_id, order.user_id, order.restaurant_id]
//     )
//     .then(res => res.rows);
// };
// exports.addRestaurantOrderStatuses = addRestaurantOrderStatuses;

// const displayItemsInOrder = function(orderId) {
//   db.query(
//     `SELECT orders.id, items.name, items.price, orders.quantity
//     FROM items
//     JOIN orders ON items.id = orders.item_id
//     WHERE order_id = $1;`,
//     [orderId]
//   ).then(res => res.rows);
// };
// exports.displayItemsInOrder = displayItemsInOrder;
