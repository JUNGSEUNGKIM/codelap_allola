const express = require('express');
const oracledb = require('oracledb');
const dbConfig = require('../dbConfig');
const bodyParser = require("body-parser");

const router = express.Router();



router.get('/', async (req, res) => {



    const loggedInUserCode = req.session.loggedInUserCode;
    const loggedInUserNickName = req.session.loggedInUserNickName;
    const loggedInUserId = req.session.loggedInUserId;
    console.log(`username: ${loggedInUserCode}`);


    // '/' 경로로의 요청은 Nginx에서 login.html을 처리하도록 리다이렉트
    res.render('alloola_main',{loggedInUserNickName});
});


module.exports = router;