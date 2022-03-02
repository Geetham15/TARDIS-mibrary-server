import connection from "../models/sqlDb.js";
import { Request, TYPES } from "tedious";

function getRating(req, res) {
  const request = new Request(
    `SELECT ROUND(AVG(rating), 2) AS avg_rating FROM ratings where recipient_id =  ${req.params.id}`,
    (err, rowCount, rows) => {
      if (err) {
        console.log(err.message);
        res.json(err.message);
      } else {
        console.log(rowCount + " row(s) returned");
        console.log(rows);
        res.json(rows);
      }
    }
  );
  connection.execSql(request);
}

export { getRating };
