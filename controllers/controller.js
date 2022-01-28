import connection from "../models/sqlDb.js";
import { Request, TYPES } from "tedious";
import { query } from "express";
import async from "async";
import bcrypt from "bcrypt";

function listBook(req, res) {
  let bookList;
  const request = new Request(
    "SELECT * FROM allBooks",
    (err, rowCount, rows) => {
      if (err) {
        console.log(err.message);
        res.json(bookList);
      } else {
        console.log(rowCount + " row(s) returned");
        bookList = rows;
        console.log(bookList);
        res.json(bookList);
      }
    }
  );
  connection.execSql(request);
}

function search(req, res) {
  let bookList;
  const request = new Request(
    `SELECT allBooks.*, Users.userName, Users.latitude, Users.longitude FROM allBooks INNER JOIN Users ON allBooks.user_id = Users.user_id WHERE title LIKE '%${req.params.title}%'`,
    (err, rowCount, rows) => {
      if (err) {
        console.log(err.message);
        res.json(null);
      } else {
        console.log(rowCount + " row(s) returned");
        bookList = rows;
        console.log(bookList);
        res.json(bookList);
      }
    }
  );
  connection.execSql(request);
}

function findUserByEmail(email) {
  let response = {};
  return new Promise((resolve, reject) => {
    const request = new Request(
      `SELECT * FROM Users WHERE email='${email}'`,
      (err, rowCount, row) => {
        if (err) {
          console.log(err.message, "hello");
          reject;
        } else {
          console.log(rowCount + " row(s) returned");

          for (let col of row[0]) {
            let columnName = col.metadata.colName;
            response[columnName] = col.value;
          }
          resolve(response);
        }
      }
    );
    connection.execSql(request);
  });
}

function deleteBookById(req, res) {
  const { id } = req.body;
  const request = new Request(`DELETE FROM allBooks WHERE id=${id}`);
}

function addBook(req, res) {
  console.log(req.body);
  const {
    title,
    authors,
    isbn_13,
    isbn_10,
    physical_format,
    condition,
    comments,
    user_id,
  } = req.body;
  const request = new Request(
    `INSERT INTO allBooks (title, authors, isbn_13, isbn_10, physical_format, condition, comments, user_id) VALUES (@title, @authors, @isbn_13, @isbn_10, @physical_format, @condition, @comments, @user_id)`,
    (err, rowCount, rows) => {
      if (err) {
        console.log(err.message);
      } else {
        console.log(rowCount + " added");
      }
    }
  );
  request.addParameter("title", TYPES.Text, title);
  request.addParameter("authors", TYPES.Text, authors);
  request.addParameter("isbn_13", TYPES.Text, isbn_13);
  request.addParameter("isbn_10", TYPES.Text, isbn_10);
  request.addParameter("physical_format", TYPES.Text, physical_format);
  request.addParameter("condition", TYPES.Text, condition);
  request.addParameter("comments", TYPES.Text, comments);
  request.addParameter("user_id", TYPES.Int, 2);

  connection.execSql(request);
  res.json({ title: req.body.title });
}

function createUser(req, res) {
  console.log(req.body);
  const { email, password, latitude, longitude } = req.body;
  const userName = req.body.username;
  const saltRounds = 10;
  bcrypt.hash(password, saltRounds, function (err, hashedPassword) {
    if (err) {
      console.log(err);
      return;
    }
    console.log(hashedPassword);
    const request = new Request(
      `INSERT INTO Users (userName, email, password, latitude, longitude) VALUES (@userName, @email, @password, @latitude, @longitude)`,
      (err, rowCount, rows) => {
        if (err) {
          console.log("username or email already exists");
          res.json({
            message: "Username or email already exists. Please try again.",
            success: false,
          });
        } else {
          console.log(rowCount + " added");
          res.json({ message: "Success! Please log in.", success: true });
        }
      }
    );
    request.addParameter("userName", TYPES.Text, userName);
    request.addParameter("email", TYPES.Text, email);
    request.addParameter("password", TYPES.Text, hashedPassword);
    request.addParameter("latitude", TYPES.Float, latitude);
    request.addParameter("longitude", TYPES.Float, longitude);

    connection.execSql(request);
  });
}

async function logIn(req, res) {
  const { email, password } = req.body;
  const user = await findUserByEmail(email);
  const match = await bcrypt.compare(password, user.password);
  if (match) {
    console.log("login successful");
    res.json({
      username: user.username,
      email: user.email,
      latitude: user.latitude,
      longitude: user.longitude,
    });
  } else {
    console.log("login failed");
    res.json(null);
  }
}

export { addBook, listBook, search, createUser, logIn };
