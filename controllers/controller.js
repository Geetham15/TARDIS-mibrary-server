import connection from "../models/sqlDb.js";
import { Request, TYPES } from "tedious";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

function bookOutOnLoan(req, res) {
  try{
    const {
      bookId,
      dateBorrowed,
      bookowner_id,
      bookborrower_id,
      dateDueForReturn,
      bookStatus
    } = req.body;
    const request = new Request(`INSERT INTO booksOutOnLoan(bookId, dateBorrowed, bookowner_id,  bookborrower_id, dateDueForReturn, bookStatus, dateReturned) VALUES (@bookId, @dateBorrowed, @bookowner_id, @bookborrower_id, @dateDueForReturn, @bookStatus,@dateReturned)`,
    (err, rowCount, rows) => {
      if (err) {
        console.log(err.message);
      
      } else {
        console.log(rowCount + " added");
        res.json({ message: "Success! Book Borrowed.", success: true });
      }
    }
    );
    request.addParameter("bookId", TYPES.Int, bookId);
    request.addParameter("dateBorrowed", TYPES.Date, dateBorrowed);
    request.addParameter("bookowner_id", TYPES.Int, bookowner_id);
    request.addParameter("bookborrower_id", TYPES.Int, bookborrower_id);
    request.addParameter("dateDueForReturn", TYPES.Date, dateDueForReturn);
    request.addParameter("bookStatus", TYPES.Char, bookStatus);
    request.addParameter("dateReturned", TYPES.Date, null);

    connection.execSql(request);
  }catch{
    console.error(err);
    res.status(500).json({ message: err.message });
  }
}

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

function listBooksByUserId(req, res) {
  let bookList;
  const request = new Request(
    `SELECT * FROM allBooks WHERE user_id=${req.params.id}`,
    (err, rowCount, rows) => {
      if (err) {
        console.log(err.message);
        res.json(bookList);
      } else {
        console.log(rowCount + " row(s) returned");
        let bookList = [];
        for (let row of rows) {
          let rowObject = {};
          for (let col of row) {
            let columnName = col.metadata.colName;
            rowObject[columnName] = col.value;
          }
          bookList.push(rowObject);
        }
        res.json(bookList);
      }
    }
  );
  connection.execSql(request);
}

function deleteBookById(req, res) {
  const request = new Request(
    `DELETE FROM allBooks WHERE id=${req.body.id}`,
    (err, rowCount, rows) => {
      if (err) {
        console.log(err.message);
        res.json(null);
      } else {
        console.log(rowCount + " row(s) returned");
        res.json({ message: "success" });
      }
    }
  );
  connection.execSql(request);
}

function search(req, res) {
  const request = new Request(
    `SELECT allBooks.*, Users.userName, Users.id, Users.latitude, Users.longitude FROM allBooks INNER JOIN Users ON allBooks.user_id = Users.id WHERE title LIKE '%${req.params.title}%'`,
    (err, rowCount, rows) => {
      if (err) {
        console.log(err.message);
        res.json(null);
      } else {
        console.log(rowCount + " row(s) returned");
        let bookList = [];
        for (let row of rows) {
          let rowObject = {};
          for (let col of row) {
            let columnName = col.metadata.colName;
            rowObject[columnName] = col.value;
          }
          bookList.push(rowObject);
        }
        console.log(bookList);
        res.json(bookList);
      }
    }
  );
  connection.execSql(request);
}

function findUserByEmail(email) {
  let response;
  return new Promise((resolve, reject) => {
    const request = new Request(
      `SELECT * FROM Users WHERE email='${email}'`,
      (err, rowCount, row) => {
        if (err) {
          console.log(err.message, "hello");
          reject;
        } else {
          console.log(rowCount + " row(s) returned");
          if (!rowCount) {
            reject;
          } else {
            response = {};
            for (let col of row[0]) {
              let columnName = col.metadata.colName;
              response[columnName] = col.value;
            }
          }

          resolve(response);
        }
      }
    );
    connection.execSql(request);
  });
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
    `INSERT INTO allBooks (title, authors, isbn_13, isbn_10, physical_format, condition, comments, user_id) OUTPUT Inserted.ID VALUES (@title, @authors, @isbn_13, @isbn_10, @physical_format, @condition, @comments, @user_id)`,
    (err, rowCount, id) => {
      if (err) {
        console.log(err.message);
      } else {
        console.log(rowCount + " added");
        console.log(id[0][0].value);
        res.json({ title: req.body.title, id: id[0][0].value });
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
  request.addParameter("user_id", TYPES.Int, user_id);

  connection.execSql(request);
}

function createUser(req, res) {
  try {
    console.log(req.body);
    const { email, password, latitude, longitude } = req.body;
    const userName = req.body.username;
    const saltRounds = 10;
    bcrypt.hash(password, saltRounds, function (err, hashedPassword) {
      if (err) {
        console.log(err);
        return;
      }
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
  } catch {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
}

async function logIn(req, res) {
  const { email, password } = req.body;
  const user = await findUserByEmail(email);
  if (!user) {
    return res.json({ message: "failed" });
  }
  const match = await bcrypt.compare(password, user.password);
  if (match) {
    console.log("login successful");
    // return jsonwebtoken
    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username,
        latitude: user.latitude,
        longitude: user.longitude,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: 86400 }
    );

    res.cookie("token", token, {
      httpOnly: true,
    });
    res.json({ message: "success" });
  } else {
    console.log("login failed");
    res.json(null);
  }
}

async function logOut(req, res) {
  try {
    res
      .cookie("token", "", {
        httpOnly: true,
        expires: new Date(Date.now()),
      })
      .json({ message: "User logged out" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

function isLoggedIn(req, res) {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.send(false);
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      return res.json(user);
    });
  } catch (error) {
    res.send(false);
  }
}

function updatePostalCode(req, res) {
  const { latitude, longitude, userId } = req.body;
  const request = new Request(
    `UPDATE Users SET latitude = ${latitude}, longitude = ${longitude} WHERE id = ${userId}`,
    (err, rowCount, rows) => {
      if (err) {
        console.log("Problem updating latitude or longitude.");
        res.json({
          message: "Problem updating latitude or longitude.",
          success: false,
        });
      } else {
        console.log(`Postal code successfully updated.`);
        res.json({
          message: `Postal code successfully updated.`,
          success: true,
        });
      }
    }
  );
  connection.execSql(request);
}

export {
  addBook,
  listBook,
  search,
  createUser,
  logIn,
  listBooksByUserId,
  deleteBookById,
  logOut,
  isLoggedIn,
  updatePostalCode,
  bookOutOnLoan,
};
