const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const path = require('path')
const methodOverride = require('method-override')
const flash = require('connect-flash');
const session = require('express-session')
const ideas = require('./routes/ideas')
const users = require('./routes/users')
const passport = require('passport')

const app = express();

// passport 

require('./config/passport')(passport)

//connect mongoose
mongoose.connect('mongodb://127.0.0.1:27017/node-app')
    .then(data => {
        console.log('MongoDB Connected...')
    })
    .catch(err => {
        console.log(err);
    })

// handlebars 
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// method override 
app.use(methodOverride('_method'))

// session meddlevier
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}))

// flash
app.use(flash())

app.use(passport.initialize());
app.use(passport.session());

// 配置静态文件
app.use(express.static(path.join(__dirname, 'public')))

// 全局中间件
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.err_msg = req.flash('err_msg');
    res.locals.error = req.flash('error');
    res.locals.users = req.user
    next();
})

// 首页
app.get('/', (req, res) => {
    res.render('home', {
        titles: 'LINK+  Notepad',
        content: 'This is a notepad tool, which is developed by LINK Creative studio. I hope you can give us some Suggestions for your convenience. Thank you! \n E-mail: 463961434 @qq.com',
        more: 'start »'
    });
});

// 关于我们
app.get('/about', (req, res) => {
    res.render('about');
});

// ideas
app.use('/ideas', ideas)

// users
app.use('/users', users)

const port = 5000;

app.listen(port);
console.log(`server is runing open in \n http://localhost:${port}`);