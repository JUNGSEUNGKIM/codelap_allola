// routes/routeTemplate.js
const express = require('express');
const oracledb = require('oracledb');
const dbConfig = require('../dbConfig');

const router = express.Router();

// GET 요청 처리
router.get('/', (req, res) => {
    const boarderCode = req.query.boarderCode;  // boarder_code 가져오기
    const userId = req.session.loggedInUserId;
    // const userName = req.session.loggedInUserName;
    const userRealName = req.session.loggedInUserRealName;
    res.render('addComment', { boarderCode: boarderCode, userId: userId, userName: userName, userRealName: userRealName });
});

// POST 요청 처리
router.post('/', async (req, res) => {
    // 로그인 여부 확인
    if (!req.session.loggedIn) {
        return res.redirect('/login'); // 로그인되지 않은 경우 로그인 페이지로 리다이렉트
    }

    const boarder_code  = req.body.boarder_code;
    const user_code = req.session.loggedInUserCode;
    const comment_id = req.body.comment_id; // req.body에서 comment_id를 가져옴
    // const { boarder_code , user_code } = req.query;
    const { content } = req.body; // 댓글 내용은 POST 요청의 본문(body)에서 가져와야 합니다.

    let conn;
    try {
        conn = await oracledb.getConnection(dbConfig);

        // 댓글 추가
        await conn.execute(
            `INSERT INTO boarder_comments (id, boarder_code, user_code, content, parent_comment_id) 
             VALUES (boarder_comments_seq.nextval, :boarder_code, :user_code, :content, :parent_id)`,
            [boarder_code, user_code, content, comment_id]
        );

        // 댓글 추가 후 해당 게시글 상세 페이지로 리다이렉트
        res.redirect(`/boarder_detailPost/${boarder_code}`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    } finally {
        if (conn) {
            try {
                await conn.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
});

module.exports = router;
