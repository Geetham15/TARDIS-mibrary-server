import express from "express";
const router = express.Router();
router.get("/bookList", async (req, res) => {
  let message =
    "Hi Team TARDIS. If you see this message, the back end is connected to the front end.";
  res.json(message);
});

export default router;