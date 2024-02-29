const express = require('express');
const oracledb = require('oracledb');
const dbConfig = require('../dbConfig');
const bodyParser = require("body-parser");

const router = express.Router();

router.get('/', async (req, res) => {
    console.log("detailMount Hello");
    const mount_code = req.query.mountcode;
    console.log("mount code :::"+ mount_code);

    try {
        // Oracle 데이터베이스 연결
        const connection = await oracledb.getConnection(dbConfig);

        // 아이디 중복 체크 쿼리 실행
        const result = await connection.execute(
            `select m.mount_name, d.address, d.mount_height, d.mount_level, d.mount_description, d.traffic from mount m join mount_detail d on m.mount_code=d.mount_code where m.mount_code=:mount_code`
            ,{mount_code},
            { fetchInfo: {
                    MOUNT_DESCRIPTION: { type: oracledb.STRING },
                    TRAFFIC: { type: oracledb.STRING }  } }
        );
        console.log("쿼리문:", result);

        res.json({
            mount_name: result.rows[0][0],
            address: result.rows[0][1],
            mount_height:result.rows[0][2],
            mount_level:result.rows[0][3],
            mount_description:result.rows[0][4],
            traffic:result.rows[0][5]


        })



        // 연결 종료
        await connection.close();
    } catch (err) {
        console.error('오류 발생:', err);
        res.status(500).json({ message: '서버 오류 발생' });
    }

});

module.exports = router;