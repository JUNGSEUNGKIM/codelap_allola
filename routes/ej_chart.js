const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

const router = express.Router();


app.set('view engine', 'ejs');


router.get('/', async (req, res) => {

    res.render('ej_chart');
});
module.exports = router;