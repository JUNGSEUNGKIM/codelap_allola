const express = require('express');
const oracledb = require('oracledb');
const dbConfig = require('../dbConfig');
const path = require("path");
const fs = require('fs');
const multer = require('multer');
const upload = multer({ dest: path.join(__dirname, 'temp'), encoding: 'utf8' });

const WEB_SERVER_HOME = 'c:\\JSKim_ago\\Util\\nginx-1.24.0\\nginx-1.24.0\\html';
const UPLOADS_FOLDER = path.join(WEB_SERVER_HOME, 'uploads');

const router = express.Router();

router.post('/',  upload.array('files', 5),async (req, res) => {
    console.log('Debug: post create');
    const {mountCode , content } = req.body;


    const files = req.files.map(file => {
        return {
            // Multer의 file객체가 관리하는 업로드된 파일의 원본 이름
            imageName: file.originalname,
            // Multer의 file객체가 관리하는 업로드된 파일의 변환된 이름
            imagePath: file.filename
        };
    });
    console.log(files);

    const userId = req.session.loggedInUserCode; // 현재 로그인한 사용자의 ID
    let conn;
    try {
        conn = await oracledb.getConnection(dbConfig);


        // 게시글을 위한 시퀀스에서 새로운 ID 가져오기
        const result = await conn.execute(
            `SELECT MOUNT_IMG_SEQ.NEXTVAL FROM DUAL`
        );
        const boarderCode = result.rows[0][0];

        // 게시글 삽입
        await conn.execute(
            `INSERT INTO mount_img (boarder_code, user_code, image_path, mount_code, comments) 
             VALUES(:boarderCode, :userCode, :image_path, :mount_code, :comments)`,
            {
                boarderCode: boarderCode,
                userCode: userId,
                image_path: files.map(file => file.imagePath).join(';'), // 파일의 변환된 이름을 세미콜론으로 구분하여 저장
                mount_code: mountCode,
                comments: content

            }
        );

        // 변경 사항 커밋
        await conn.commit();

        for (const file of req.files) {
            const tempFilePath = file.path;
            const targetFilePath = path.join(UPLOADS_FOLDER, file.filename);

            // 임시폴더의 파일을 타겟 경로로 이동
            fs.renameSync(tempFilePath, targetFilePath);
        }

        // 게시글 작성 후 게시판 메인 페이지로 리다이렉트
        res.redirect('/mapPage');
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