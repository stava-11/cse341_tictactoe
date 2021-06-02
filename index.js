require('dotenv').config({ encoding: 'UTF-8' })
require('dotenv').config({ path: __dirname + '/.env' });

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
//const routes = require('./routes');
const PORT = process.env.PORT || 5000 
//const User = require('./models/user');
const cors = require('cors');
const corsOptions = {
    origin: "https://ta03-cse341.herokuapp.com/",
    optionsSuccessStatus: 200
  };
const MONGODB_URI = process.env.MONGODB_URI;
const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI, 
  collection: 'sessions'
});
//const csrfProtection  = csrf();

const users = [];
app.set('view engine', 'ejs');
app.set('views', 'views');
app
.use(cors(corsOptions))
 // .use('/', routes);

const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  family: 4
};

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));
//app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(session({
  secret: 's3Cur3', 
  resave: false, 
  saveUninitialized: false,
  store: store
 })
);
//app.use(csrfProtection);

// app.use((req, res, next) => {
//   res.locals.isAuthenticated = req.session.isLoggedIn;
//   res.locals.csrfToken = req.csrfToken();
//   next();
// });

// app.use((req, res, next) => {
//   //throw new Error('Sync Dummy');
//   if (!req.session.user){
//     return next();
//   }
//   User.findById(req.session.user._id)//('609583ea3f161a723a332044')//("60947956b893eb8bf3e04661")
//     .then(user => { 
//       //throw new Error('Dummy!);
//       if (!user) {
//       return next();
//     }
//       req.user = user;
//       next();
//     })
//     .catch(err => {
//       //console.log(err));
//       //next();
//       //throw new Error(err);
//       next(new Error(err));
//     });
// });

app.get('/', (req, res, next) => {
    res.render('index', { pageTitle: 'Add User' });
  });
  
  app.get('/users', (req, res, next) => {
    res.render('users', {
      pageTitle: 'User',
      users: users,
      hasUsers: users.length > 0
    });
  });
  
  app.post('/add-user', (req, res, next) => {
    users.push({ name: req.body.username });
    res.redirect('/users');
  });
mongoose
  .connect(MONGODB_URI, options)
  .then(result => {
    app.listen(PORT);
})
.catch(err => {
  console.log(err);
});