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

export { sendChat };
