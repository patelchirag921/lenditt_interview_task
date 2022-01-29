var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Mysql@123456",
  database:"main"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

module.exports=con;