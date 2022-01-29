const express = require("express");
const app = express();
const port = 3000;
const con = require("./database.js");
const bodyparser = require('body-parser');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

app.set("view engine", "hbs");

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.get("/", (req, res) => {
    res.render("index");
});
app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/register", (req, res) => {
    const sqlselect = `select * from user where email='${req.body.email}'`;
    con.query(sqlselect, function (err, result) {
        if (err) {
            console.log(err);
            res.redirect("register");
        }
        else if (!result.length) {
            const sql = `insert into user(name,email,password) values('${req.body.name}','${req.body.email}','${req.body.psw}')`;
            con.query(sql, function (err, result) {
                if (err) {
                    console.log(err);
                    res.redirect("register");
                }
                else { res.render("login") };

            });
        } else {
            res.render("register", {
                message: "user already exits"
            });
        }

    });



});

app.get("/login", (req, res) => {
    res.render("login");

});
app.post("/login", (req, res) => {
    const sqlselect = `select * from user where email='${req.body.email}' AND password='${req.body.psw}'`;
    con.query(sqlselect, function (err, result) {
        if (err) throw err;
        if (result.length) {

            const a = jwt.sign(result[0].email, "chiragpatel");
          
            res.cookie("jwt", a, {
                maxAge: 600000,

                httpOnly: true
            });
            res.redirect("home");
        }
        else {
            res.render("login", {
                unregisterusr: "please register first."
            });
         
        }
    });


});
app.get("/logout", (req, res) => {
    res.clearCookie("jwt");
    res.redirect('/');
});


app.get("/home", (req, res) => {
    const token = req.cookies.jwt;
    if (!token) {
        res.redirect('/login');
    }

    const verifyuser = jwt.verify(token, "chiragpatel");
  
    if (verifyuser) {
        res.render("home", {
            username: verifyuser
        });
    }
    else {
        res.redirect("login");
    };
});
app.get("/*", (req, res) => {
    res.render("404");

});
app.listen(port, () => {
    console.log(`server is listening at port ${port}`);
});









