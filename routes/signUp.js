const express = require('express');
const oracledb = require('oracledb');
const dbConfig = require('../dbConfig');
const bodyParser = require("body-parser");

const router = express.Router();


router.get('/', (req, res) => {

    // '/' 경로로의 요청은 Nginx에서 login.html을 처리하도록 리다이렉트
    res.redirect('/alloola_signup.html');
});


router.post('/', bodyParser.urlencoded({ extended: false }), async (req, res) => {
    console.log('Debug: post create');
    const { id, password, gender, name,birth,nickname } = req.body;
    console.log(birth);
    let conn;
    try {
        conn = await oracledb.getConnection(dbConfig);

        // 게시글을 위한 시퀀스에서 새로운 ID 가져오기
        const result = await conn.execute(
            `SELECT user_table_seq.NEXTVAL
             FROM DUAL`
        );
        const userId = result.rows[0][0];

        await conn.execute(
            ' insert into user_table (id, password, gender, name, birth, nickname, user_code) VALUES (:id, :password, :gender, :name,to_date(:birth,\'YYYY-MM-DD\'),:nickname, :userId)',
            [id, password, gender, name, birth, nickname, userId]
        )

        await conn.commit();
        res.redirect('/login');

    } catch (err) {
        console.error('글 작성 중 오류 발생:', err);
        res.status(500).send('글 작성 중 오류가 발생했습니다.');
    } finally {
        if (conn) {
            try {
                await conn.close();
            } catch (err) {
                console.error('오라클 연결 종료 중 오류 발생:', err);
            }
        }
    }


});

module.exports = router;