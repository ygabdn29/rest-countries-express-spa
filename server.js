const express = require("express");
const path = require("path");

const app = express();

app.use("/static", express.static(path.resolve(__dirname, "public")));

app.get("/*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./public/views", "index.html"));
});

app.listen(process.env.PORT || 5501, () => console.log("Server Running..."));
