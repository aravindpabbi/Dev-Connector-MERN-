const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const connectDB = require("./config/db");
var cors = require("cors");

connectDB();

// Init Middleware

app.use(express.json({ extended: false }));
app.use(cors());
app.get("/", (req, res) => {
	res.send("API running");
});

//Define Routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/posts", require("./routes/api/posts"));
app.use("/api/profile", require("./routes/api/profile"));

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
