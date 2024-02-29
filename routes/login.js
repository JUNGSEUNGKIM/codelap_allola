const express = require('express');
const oracledb = require('oracledb');
const dbConfig = require('../dbConfig');
const bodyParser = require("body-parser");

const router = express.Router();


router.get('/', (req, res) => {

    // '/' 경로로의 요청은 Nginx에서 login.html을 처리하도록 리다이렉트
    res.redirect('/alloola_login.html');
});

router.post('/', bodyParser.urlencoded({ extended: false }), async (req, res) => {
    console.log('Debug: post login');
    const { id, password } = req.body;
    const authenticatedUser = await varifyID(id, password);

    // console.log(`authenticatedUser.id: ${authenticatedUser.id}
    //     authenticatedUser.username: ${authenticatedUser.username} authenticatedUser.name ${authenticatedUser.name}`);
    // const id = authenticatedUser.id;
    // const name = authenticatedUser.name;
    if (authenticatedUser) {
        req.session.loggedIn = true;
        req.session.loggedInUserCode = authenticatedUser.user_code; // 사용자 테이블의 ID (PK) 저장
        req.session.loggedInUserId = authenticatedUser.id;           // 사용자 테이블의 username
        req.session.loggedInUserNickName = authenticatedUser.nickname; // 사용자 테이블에서 실제 이름 저장
        // res.redirect(`/boardMain?id=${authenticatedUser.id}&username=${authenticatedUser.username}&name=${authenticatedUser.name}`);
        res.redirect(`/mainPage`);
        // res.redirect('welcome', { WEB_SERVER_HOME, username });
    } else {
        res.render('loginFail',{ id});
    }
});

async function varifyID(username, password) {
    let connection;

    try {
        connection = await oracledb.getConnection(dbConfig);

        const result = await connection.execute(
            'SELECT * FROM user_table WHERE id = :username AND password = :password',
            { username, password }
        );

        if (result.rows.length > 0) {
            console.log('varifyID');
            console.log(result.rows[0][0]);
            return {
                user_code: result.rows[0][7],
                nickname: result.rows[0][5],
                id: result.rows[0][0]
            };
        } else {
            return null;
        }
    } catch (error) {
        console.error('오류 발생:', error);
        return null;
    } finally {
        if (connection) {
            await connection.close();
        }
    }
}

module.exports = router;