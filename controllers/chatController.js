import connection from "../models/sqlDb.js";
import { Request, TYPES } from "tedious";

const sendChat = (req, res) => {
  const { fromUserId, toUserId, message } = req.body;
  const request = new Request(
    `INSERT INTO chats (fromUserId, toUserId, message, dateAndTime)
  VALUES (@fromUserId, @toUserId, @message, DEFAULT)`,
    (err, rowCount, row) => {
      if (err) {
        console.log(err.message);
        console.log({ message: "failed" });
        return;
      } else {
        console.log(rowCount + " added");
        console.log({ message: "success" });
        return;
      }
    }
  );
  request.addParameter("fromUserId", TYPES.Int, fromUserId);
  request.addParameter("toUserId", TYPES.Int, toUserId);
  request.addParameter("message", TYPES.Text, message);

  connection.execSql(request);
};

const loadChats = (req, res) => {
  const fromUserId = req.query.fromUserId;
  const toUserId = req.query.toUserId;
  const request = new Request(
    `SELECT * FROM chats WHERE (fromUserId = ${fromUserId} AND toUserId = ${toUserId}) OR (toUserId = ${fromUserId} AND fromUserId = ${toUserId})`,
    (err, rowCount, rows) => {
      if (err) {
        console.log(err.message);
        res.json(null);
      } else {
        console.log(rowCount + " row(s) returned");
        let chatList = [];
        for (let row of rows) {
          let rowObject = {};
          for (let col of row) {
            let columnName = col.metadata.colName;
            rowObject[columnName] = col.value;
          }
          chatList.push(rowObject);
        }
        res.json(chatList);
      }
    }
  );
  connection.execSql(request);
};

const loadUsers = (req, res) => {
  let userList = [];
  const request = new Request(
    "SELECT id, username FROM Users",
    (err, rowCount, rows) => {
      if (err) {
        console.log(err.message);
        res.json(userList);
      } else {
        console.log(rowCount + " row(s) returned");
        for (let row of rows) {
          let rowObject = {};
          for (let col of row) {
            let columnName = col.metadata.colName;
            rowObject[columnName] = col.value;
          }
          userList.push(rowObject);
        }
        res.json(userList);
      }
    }
  );
  connection.execSql(request);
};

export { sendChat, loadChats, loadUsers };
