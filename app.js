const express = require('express');
const chalk = require('chalk');
const debug = require('debug')('app');
const morgan = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const app = express();
const port = process.env.PORT || 3000;

app.use(morgan('tiny'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ secret: 'library' }));

require('./src/config/passport.js')(app);

app.use(express.static(path.join(__dirname, '/public/')));
app.use('/css', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/jquery/dist')));
app.use('/css', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/css')));
app.set('views', './src/views');
app.set('img', '/img');
app.set('view engine', 'ejs');

const nav = [
  { link: '/books', title: 'Книги' },
  { link: '/authors', title: 'Автори' },
  { link: '/department', title: 'Відділення' },
  { link: '/abiturient', title: 'Абітурієнту' },
  { link: '/student', title: 'Студенту' },
  { link: '/teacher', title: 'Викладачу' },
  { link: '/gallery', title: 'Галерея' },
  { link: '/contacts', title: 'Контакти' }
];

const bookRouter = require('./src/routes/bookRoutes')(nav);
const adminRouter = require('./src/routes/adminRoutes')(nav);
const authRouter = require('./src/routes/authRoutes')(nav);

app.use('/books', bookRouter);
app.use('/admin', adminRouter);
app.use('/auth', authRouter);

app.get('/', (req, res) => {
  res.render(
    'index',
    {
      nav,
      title: 'Бібліотека коледжу'
    }
  );
});

app.get('/', (req, res) => {
  res.setHeader('Content-Type', 'text/plain');
  res.end('Ти в бібліотеці');
});

app.listen(port, () => {
  debug(`listening on port ${chalk.green(port)}`);
});
