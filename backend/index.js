const express = require("express");

const connect =require("./database/db");

const app = express();
const port = process.env.PORT || 5000;
require ('dotenv').config();
connect();

app.use(express.json({extended: false}));

// if (process.env.NODE_ENV === "production") {
// 	app.use(express.static("build"));
// 	app.get("*", (req, res) =>
// 		res.sendFile(path.resolve(__dirname, "build", "index.html"))
// 	);
// }


app.listen(port, ()=> {console.log("---------------------"), 
console.log('server running on port ' + port)});