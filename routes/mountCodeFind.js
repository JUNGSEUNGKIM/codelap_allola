const express = require('express');
const oracledb = require('oracledb');
const dbConfig = require('../dbConfig');
const bodyParser = require("body-parser");

const router = express.Router();

router.get('/', async (req, res) => {
    console.log("detailMount Hello");
    const mount_name = req.query.mountname;
    console.log("mount code :::"+ mount_name);

    try {
        // Oracle 데이터베이스 연결
        const connection = await oracledb.getConnection(dbConfig);

        // 아이디 중복 체크 쿼리 실행
        const result = await connection.execute(
            `select mount_code from mount where mount_name=:mountname`
            ,{mount_name}

        );
        res.json({
            mountcode: result.rows[0][0]
        })



        // 연결 종료
        await connection.close();
    } catch (err) {
        console.error('오류 발생:', err);
        res.status(500).json({ message: '서버 오류 발생' });
    }

});

module.exports = router;