const express = require('express');
const oracledb = require('oracledb');
const dbConfig = require('../dbConfig');
const bodyParser = require("body-parser");
const router = express.Router();

router.get('/', async (req, res) => {
    console.log("detailMount Hello");
    const boarder_code = req.query.boarderCode;
    console.log("mount code :::"+boarder_code );

    try {
        // Oracle 데이터베이스 연결
        const connection = await oracledb.getConnection(dbConfig);
        console.log(" likes come in ");

        // 아이디 중복 체크 쿼리 실행
        const result = await connection.execute(
            `update boarder set likes = likes + 1 where boarder_code = :boarderCode`
            ,[boarder_code]

        );
        await connection.commit();
        // console.log("쿼리문:", result);


        // 연결 종료
        await connection.close();

    } catch (err) {
        console.error('오류 발생:', err);
        res.status(500).json({ message: '서버 오류 발생' });
    }

});


module.exports = router;