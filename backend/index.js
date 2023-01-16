const express = require("express");
const fileUpload = require ("express-fileupload");
const connect =require("./database/db");

const app = express();
const port = process.env.PORT || 5000;
require ('dotenv').config();
connect();

app.use(express.json({extended: false}));
app.use(fileUpload());

app.use("/api/users", require("./route/user"));
app.use("/api/auth", require("./route/auth"));
app.use("/api/student", require("./route/student"));
app.use("/api/guru", require("./route/guru"));
app.use("/api/mapel", require("./route/mapel"));
app.use("/api/class", require("./route/classes"));
app.use("/api/ujian", require("./route/ujian"));
app.use("/api/upload", require("./route/upload"));


if (process.env.NODE_ENV === "production") {
	app.use(express.static("build"));
	app.get("*", (req, res) =>
		res.sendFile(path.resolve(__dirname, "build", "index.html"))
	);
}


app.listen(port, ()=> {console.log("---------------------"), 
console.log('server running on port ' + port)});