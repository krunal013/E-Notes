//require some packages for our app
const { error } = require("console");
const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");

//setting up middleware for our app
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
//middleware finished

//dynamic routing
app.get("/todo", function (req, res) {
  fs.readdir(`./files`, function (err, files) {
    res.render("todo", { files: files });
  });
});

app.get("/", function (req, res) {
  res.render("index");
});

app.get("/file/:filename", function (req, res) {
  fs.readFile(
    `./files/${req.params.filename}`,
    "utf-8",
    function (err, filedata) {
      res.render("show", {
        filename: req.params.filename,
        filedata: filedata,
      });
    }
  );
});

app.get("/edit/:filename", function (req, res) {
  res.render("edit", { filename: req.params.filename });
});

app.post("/edit", function (req, res) {
  fs.rename(
    `./files/${req.body.previous}`,
    `./files/${req.body.new}`,
    function (err) {
      res.redirect("/todo");
    }
  );
});

app.post("/create", function (req, res) {
  fs.writeFile(
    `./files/${req.body.title.split("").join("")}.txt`,
    req.body.details,
    function (err) {
      res.redirect("/todo");
    }
  );
});

//port handling
app.listen(3000, function () {
  console.log("Server started on port 3000");
});
