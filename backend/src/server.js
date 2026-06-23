import express from  "express";
import {ENV} from "./lib/env.js";

const app = express();

console.log(process.env.PORT);
console.log(process.env.DB_URL);

app.get("/", (req, res) => {
    res.status(200).json({msg : "Welcome to SLIIT-IQ Backend"})
});

app.listen(3000, () => console.log("Server is running on port 3000"));