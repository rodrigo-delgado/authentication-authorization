
const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
const http = require('http')
const _ = require('lodash')


app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.set('trust proxy', 1)
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  seveUninitialized: true,
  cookie: { secure: false },
  unset: 'destroy'
}))

users = [
  { name: 'Mis', admin: true , password:'111' },
  { name: 'Bill', admin: false , password: '1234'},
  { name: 'Matt', admin: false , password: '5678'}
]

app.get('/login', (req, res) => {
  console.log(req.body);
  res.sendfile(__dirname + '/login.html')
})


app.post('/login', (req, res) => {
  console.log('req.body is :', req.body);

  const user = _.find(users, {name: req.body.name})
  if(!user) {
    res.json({ message: 'No user found, sorry!'})
  } else if (user.password === req.body.password) {

    req.session.userName = user.name
    req.session.isAdmin = user.admin

    res.json({message: 'you loged in'})
  } else {
    res.json({message: 'Incorrect password, please try again'})
  }
})


app.get('/public', (req, res) => {
  res.send('YEAH! you got it')
})


function isAuthenticated(req, res, next) {
  console.log(req.session);
  if(req.session.userName) {
    console.log('nope');
    next()
  } else {
    res.send('nope')
  }
}
function isAdmin(req, res, next) {
  if(req.session.isAdmin){
    console.log('nope')
    next()
  } else {
    res.send('nope')
  }
}
app.get('/private', isAuthenticated, (req, res) => {
  res.send('YEAH! you got it')
})
app.get('/admin', isAdmin, (req, res) => {
  res.send('YEAH! you are admin')
})


const port = process.env.PORT || 3000
const server = http.createServer(app)

server.listen(port)
console.log('Server running on: ', port);
