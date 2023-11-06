import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import bluebird from "bluebird";
import connection from "../config/connectDB";

const salt = bcrypt.genSaltSync(10);

const hashUserPassword = (userPassword) => {
  let hashPassword = bcrypt.hashSync(userPassword, salt);

  return hashPassword;
};
// test connectDB
connection();

const createNewUser = async (email, password, username) => {
  let hashPass = hashUserPassword(password);
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "jwt",
    Promise: bluebird,
  });
  try {
    const [rows, fields] = await connection.execute(
      "INSERT INTO users (email, password, username) VALUES (?, ?, ?)",
      [email, hashPass, username]
    );
  } catch (error) {
    console.log("check error", error);
  }
};

const getUserList = async () => {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "jwt",
    Promise: bluebird,
  });
  let users = [];
  try {
    const [rows, fields] = await connection.execute("SELECT * FROM users");
    return rows;
  } catch (error) {
    console.log(">> check error", error);
  }
};

const deleteUser = async (id) => {
  // DELETE FROM users WHERE id;
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "jwt",
    Promise: bluebird,
  });
  let users = [];
  try {
    const [rows, fields] = await connection.execute(
      "DELETE FROM users WHERE id=?",
      [id]
    );
  } catch (error) {
    console.log(">> check error", error);
  }
};
const getUserById = async (id) => {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "jwt",
    Promise: bluebird,
  });
  try {
    const [rows, fields] = await connection.execute(
      "Select * FROM users WHERE id=?",
      [id]
    );
    console.log(">>> check row", rows);

    return rows;
  } catch (error) {
    console.log(">> check error", error);
  }
};

const updateUserInfor = async (email, username, id) => {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "jwt",
    Promise: bluebird,
  });
  try {
    const [rows, fields] = await connection.execute(
      " UPDATE users SET email = ?, username = ? WHERE id = ?;",
      [email, username, id]
    );
    console.log(">>> check row", rows);

    return rows;
  } catch (error) {
    console.log(">> check error", error);
  }
};
module.exports = {
  createNewUser,
  getUserList,
  deleteUser,
  getUserById,
  updateUserInfor,
};
