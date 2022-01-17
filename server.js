const express = require("express")
const cors = require("cors")
const router = require( "./routes/bookRoutes.js")
const app = express();
const port = 5000;

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5000"],
  })
);

app.use(express.json());

app.use("/api", router);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
