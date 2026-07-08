import express from "express";
import path from "path";
import cors from "cors";
import { serve } from "inngest/express";

import { ENV } from "./lib/env.js";
import { connectDB } from "./lib/db.js";
import { inngest, functions } from "./lib/inngest.js";


const app = express();

const __dirname = path.resolve();

//Middleware
app.use(express.json())
// Server allows browser to include cookies on request
app.use(cors({origin:ENV.CLIENT_URL, credentials:true}))

app.use("/api/inngest", serve({client:inngest, functions: functions}))


app.get("/sliit", (req, res) => {
    res.status(200).json({msg : "Welcome to SLIIT-IQ Backend"})
});

app.get("/it", (req, res) => {
    res.status(200).json({msg : "This is the data science endpoint"})
});

//make sliit-iq app ready for deployment
if(ENV.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get("/{*any}", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend","dist","index.html"));
    });
}

app.listen(ENV.PORT, () => {
    console.log("✅ Server is running on port:", ENV.PORT)
    connectDB();
});