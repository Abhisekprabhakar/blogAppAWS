const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
require("dotenv").config();
const app = express();
const mysql = require("mysql");

const con = mysql.createConnection({
  host: process.env.RDS_HOSTNAME,
  user: process.env.RDS_USERNAME,
  password: process.env.RDS_PASSWORD,
  port: process.env.RDS_PORT,
});

con.connect(function (err) {
  if (err) console.log(err);
  else {
    console.log("Connected!");
    var sql = "CREATE DATABASE IF NOT EXISTS blogApp";
    con.query(sql, function (err, result) {
      if (err) console.log(err);
      else {
        let useQuery = `USE blogApp`;
        con.query(useQuery, (error) => {
          if (error) console.log(err);
          else {
            console.log("Using Database");
            var sql =
              "CREATE TABLE IF NOT EXISTS blogs (_id int AUTO_INCREMENT PRIMARY KEY,title VARCHAR(255), category VARCHAR(255),content VARCHAR(255),created date default(CURRENT_DATE))";
            con.query(sql, function (err, result) {
              if (err) console.log(err);
              console.log("Table created");
            });
          }
        });
      }
    });
  }
});

app.use(express.static(path.join(__dirname, "/public/")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.set("views", "./views");
app.set("view engine", "ejs");
//app.use("/blogs", routes);

var port = process.env.PORT || 3000;
//List of Blogs
app.get("/", (req, res) => {
  con.query("SELECT * FROM blogs", function (err, result, fields) {
    if (err) {
      console.log(err);
    } else {
      res.render("index", { blogs: result });
    }
  });
});

app.get("/blogs/add", (req, res) => {
  res.render("addblog");
});

app.post("/blogs/add", (req, res) => {
  var sql = `INSERT INTO blogs (title,category,content) VALUES ('${req.body.blog.title}','${req.body.blog.category}','${req.body.blog.content}')`;
  con.query(sql, function (err, result) {
    if (err) {
      console.log("post request error:", err);
      res.render("errorpage", { validationerror: err });
    } else {
      var sql1 = " SELECT LAST_INSERT_ID() As _id;";
      con.query(sql1, function (err, result) {
        res.redirect("/blogs/" + result[0]._id);
      });
    }
  });
});

//update
app.get("/blogs/edit/:id", (req, res) => {
  con.query(
    `select * from blogs where _id=${req.params.id}; `,
    function (err, result, fields) {
      if (err) {
        console.log("get request error:", err);
        res.redirect("/");
      } else {
        if (typeof result[0] != "undefined") {
          res.render("editblog", { blog: result[0] });
        } else {
          console.log("No blog found for the given ID");
          res.render("errorpage", { notfound: "Not found" });
        }
      }
    }
  );
});

app.put("/blogs/edit/:id", function (req, res) {
  con.query(
    `select * from blogs where _id=${req.params.id}; `,
    function (err, result, fields) {
      if (err) {
        console.log("get request error:", err);
        res.redirect("/");
      } else {
        if (typeof result[0] != "undefined") {
          var sql1 = `UPDATE blogs SET title='${req.body.blog.title}',category='${req.body.blog.category}',content='${req.body.blog.content}' Where _id='${req.params.id}'`;
          con.query(sql1, function (err, result) {
            if (err) {
              console.log("put request error:", err);
              res.redirect("errorpage", { validationerror: err });
            } else {
              res.redirect("/blogs/" + req.params.id);
            }
          });
        } else {
          console.log("No blog found for the given ID");
          res.render("errorpage", { notfound: "Not found" });
        }
      }
    }
  );
});

//delete post
app.delete("/blogs/delete/:id", (req, res) => {
  con.query(
    `DELETE FROM blogs WHERE _id = '${req.params.id}'`,
    function (err, result, fields) {
      if (err) {
        console.log("delete request error:", err);
        res.redirect("/");
      } else {
        res.redirect("/");
      }
    }
  );
});

//View Blog
app.get("/blogs/:id", (req, res) => {
  con.query(
    `select * from blogs where _id=${req.params.id}; `,
    function (err, result, fields) {
      if (err) {
        console.log("get request error:", err);
        res.redirect("/");
      } else {
        if (typeof result[0] != "undefined") {
          res.render("blog", { blog: result[0] });
        } else {
          console.log("No blog found for the given ID");
          res.render("errorpage", { notfound: "Not found" });
        }
      }
    }
  );
});

app.get("*", function (req, res) {
  res.redirect("/");
});

var server = app
  .listen(port, () => {
    console.log(`Server running @ http://localhost:${port}/`);
  })
  .on("error", function (err) {
    if (err.code === "EADDRINUSE") {
      port++;
      console.log("Address in use, retrying on port " + port);
      app.listen(port, () => {
        console.log(`Server running @ http://localhost:${port}/`);
      });
    }
  });

//  var sql = `INSERT INTO blogs (title,category,content,created) VALUES ('Company Inc', 'Highway 37','testing','${Date.now()}')`;
//  con.query(sql, function (err, result) {
//    if (err) throw err;
//    console.log("1 record inserted");
//  });
//  con.query("SELECT * FROM blogs", function (err, result, fields) {
//    if (err) throw err;
//    console.log(result);
//  });

// var sql = "DROP TABLE blogs";
// con.query(sql, function (err, result) {
//   if (err) throw err;
//   console.log("Table deleted");
// });
// var sql =
//   "CREATE TABLE blogs (_id int AUTO_INCREMENT PRIMARY KEY,title VARCHAR(255), category VARCHAR(255),content VARCHAR(255),created date default(CURRENT_DATE))";
// con.query(sql, function (err, result) {
//   if (err) throw err;
//   console.log("Table created");
// });
