const express = require('express');
const oracledb = require('oracledb');
const bodyParser = require('body-parser');
const session = require('express-session');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const {user} = require("./dbconfig");

const app = express();
const port = 3000;




app.set('view engine', 'ejs');
const WEB_SERVER_HOME = 'c:\\insu\\Utill\\nginx-1.24.0\\html';


app.use('/', express.static(WEB_SERVER_HOME+ '/'));
app.use(bodyParser.urlencoded({ extended: false }));


app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true
}));

const dbConfig = {
    user: 'mountain_100',
    password: '1111',
    connectString: 'localhost:1521/xe'
};



const upload = multer({ dest: path.join(__dirname, 'temp'), encoding: 'utf8' });
const UPLOADS_FOLDER = path.join(WEB_SERVER_HOME, 'uploads');
app.use('/', express.static(WEB_SERVER_HOME+ '/'));
app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'ejs');
oracledb.initOracleClient({ libDir: '/instantclient_21_13' });
oracledb.autoCommit = true;

app.use('/signUp', require('./routes/signUp'));
app.use('/login', require('./routes/login'));
app.use('/mainPage', require('./routes/mainPage'));
app.use('/mapPage', require('./routes/mapPage'));
app.use('/detailMountMap', require('./routes/detailMountMap'));
app.use('/boarder_addComment', require('./routes/boarder_addComment'));
app.use('/boarder_editComment', require('./routes/boarder_editComment'));
app.use('/boarder_deleteComment', require('./routes/boarder_deleteComment'));
app.use('/boarder_boardMain', require('./routes/boarder_boardMain'));
app.use('/boarder_create', require('./routes/boarder_create'));
app.use('/boarder_deletePost', require('./routes/boarder_deletePost'));
app.use('/boarder_detailPost', require('./routes/boarder_detailPost'));
app.use('/boarder_editPost', require('./routes/boarder_editPost'));


app.use('/ej_addComment', require('./routes/ej_addComment'));
app.use('/ej_editComment', require('./routes/ej_editComment'));
app.use('/ej_deleteComment', require('./routes/ej_deleteComment'));
app.use('/ej_boardMain', require('./routes/ej_boardMain'));
app.use('/ej_create', require('./routes/ej_create'));
app.use('/ej_deletePost', require('./routes/ej_deletePost'));
app.use('/ej_detailPost', require('./routes/ej_detailPost'));
app.use('/ej_editPost', require('./routes/ej_editPost'));

app.use('/customshop_addComment', require('./routes/customshop_addComment'));       // 댓글 추가
app.use('/customshop_editComment', require('./routes/customshop_editComment'));     // 댓글 수정
app.use('/customshop_deleteComment', require('./routes/customshop_deleteComment')); // 댓글 삭제
app.use('/customshop_boardMain', require('./routes/customshop_boardMain'));         // 게시판 메인
app.use('/customshop_create', require('./routes/customshop_create'));               // 게시글 생성
app.use('/customshop_deletePost', require('./routes/customshop_deletePost'));       // 게시글 삭제
app.use('/customshop_detailPost', require('./routes/customshop_detailPost'));       // 게시글 상세
app.use('/customshop_editPost', require('./routes/customshop_editPost'));           // 게시글 수정
app.use('/customshop_liks', require('./routes/customshop_liks'));                   // 찜

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}/mainPage`);
});
