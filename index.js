const express = require('express');
const path = require('path');
const logger = require('./middleware/logger');
const exphbs = require('express-handlebars');
const courses = require('./Courses');
const app = express();


// init middleware
//app.use(logger);

// Handlebars middleware
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// set static folder
//app.use(express.static(path.join(__dirname, 'public')));

// Home page route handlebars
app.get('/', (req, res) => res.render('index', {
  title: 'Course App',
  courses
}));


// Courses API Routes

app.use('/api/courses', require('./routes/api/courses'));



const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Example app listening on  ${port}!`));
