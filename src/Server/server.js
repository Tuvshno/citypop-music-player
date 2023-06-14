import express from 'express';
import mysql from 'mysql';
import cors from 'cors'
import bcrypt, { hash } from 'bcrypt'

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',      // your mysql username
  password: 'Icanownu123',  // your mysql password
  database: 'citypop'
});


// const db = mysql.createConnection({
//   host: 'citypop-instance.cidbzyetacgy.us-east-2.rds.amazonaws.com',  // replace with your RDS endpoint
//   user: 'admin',             // replace with your master username
//   password: 'Tuvshno1',         // replace with your master password
//   database: 'citypop'            // replace with your database name
// });


db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('MySQL Connected...');
});

const app = express();
app.use(cors());
app.use(express.json());
const saltRounds = 10;

// GET users
app.get('/getusers', (req, res) => {
  let sql = 'SELECT * FROM Users';
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

// GET songs
app.get('/getsongs', (req, res) => {
  let sql = 'SELECT * FROM songs';
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

//POST Check Username and Password Exists
app.post('/login', function (req, res) {
  const { username, password } = req.body;
  console.log('login recieved')
  console.log(username)
  console.log(password)


  db.query('SELECT * FROM users WHERE username = ?', [username], function (error, results, fields) {
    if (error) throw error;
    console.log(results)
    if (results.length > 0) {
      console.log('inside results')
      const hashedPassword = results[0].password;
      console.log(hashedPassword)

      bcrypt.compare(password, hashedPassword, function (err, result) {
        console.log(`${password} and ${hashedPassword}`)
        console.log(result)
        if (result == true) {
          console.log('exists')
          res.status(200).send("User exists");
        } else {
          console.log('doesnt exist')
          res.status(401).send("Incorrect password");
        }
      });
    } else {
      res.status(401).send("User doesn't exist");
    }
  });
});

//POST Check Username and Password Exists
app.post('/username', function (req, res) {
  console.log(req.body)
  db.query('SELECT * FROM users WHERE username = ?', [req.body.username], function (error, results, fields) {
    if (error) throw error;
    console.log(results.length)
    res.send(results.length === 1);
  });
});

//POST Signup an account
app.post('/signup', function (req, res) {
  const { username, password } = req.body;

  // Hash the password using bcrypt
  bcrypt.hash(password, saltRounds, function (err, hashedPassword) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }

    // Store hashed password in the database
    db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], function (error, results, fields) {
      if (error) {
        console.log(error);
        res.sendStatus(500);
        return;
      }

      // If there was no error, the insert was successful
      res.sendStatus(201);
    });
  });
});


// Listen on a port
app.listen(process.env.PORT || '5000', () => {
  console.log('Server started on port 5000');
});