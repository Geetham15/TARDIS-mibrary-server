import connection from "../models/sqlDb.js";
import { Request, TYPES } from "tedious";
import { query } from "express";
import async from "async";

function listBook(req, res) {
  let bookList;
  const request = new Request(
    "SELECT * FROM allBooks",
    (err, rowCount, rows) => {
      if (err) {
        console.log(err.message);
        res.json(bookList);
      } else {
        console.log(rowCount + " row(s) returned", rows);
        bookList = rows;
      }
    }
  );
  connection.execSql(request);
  res.json(bookList);
}

// async function search(req, res) {
//   let result = await BookShelves.findOne({
//     title: { $regex: new RegExp("^" + req.params.title + "$", "i") },
//   });
//   console.log(result);
//   res.json(result);
// }

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

function dropTable(callback) {
  console.log("Dropping table if exists...");

  // Read all rows from table
  const request = new Request(
    `DROP TABLE IF EXISTS allBooks`,
    (err, rowCount) => {
      if (err) {
        console.error(err.message);
      } else {
        console.log("table dropped");
        callback(null);
      }
    }
  );
  request.on("requestCompleted", (rowCount, more) => {
    console.log("disconnecting");
    connection.close();
  });
  connection.execSql(request);
}

function createTable() {
  console.log("Creating new table...");

  // Read all rows from table
  const request = new Request(
    `CREATE TABLE allBooks (id INTEGER PRIMARY KEY IDENTITY(1,1), title TEXT NOT NULL, authors TEXT NOT NULL, isbn_13 TEXT, isbn_10 TEXT, physical_format TEXT, condition TEXT, comments TEXT, user_id INTEGER NOT NULL)`,
    (err, rowCount) => {
      if (err) {
        console.error(err.message);
      } else {
        console.log("table created");
      }
    }
  );
  request.on("requestCompleted", (rowCount, more) => {
    connection.close();
  });
  connection.execSql(request);
}

const dropOldAndCreateNewTable = () => {
  connection.on("connect", (err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log("Connected to SQL database");
      async.waterfall([dropTable, createTable], () => {
        console.log("complete");
      });
    }
  });
  connection.connect();
};

export { addBook, listBook };
