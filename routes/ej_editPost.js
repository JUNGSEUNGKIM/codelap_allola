const express = require('express');
const oracledb = require('oracledb');
const dbConfig = require('../dbConfig');

const router = express.Router();

router.get('/:boarderCode', async (req, res) => {
    // 로그인 여부 확인
    if (!req.session.loggedIn) {
        return res.redirect('/login'); // 로그인되지 않은 경우 로그인 페이지로 리다이렉트
    }

    const boarderCode = req.params.boarderCode;
    const userId = req.params.loggedInUserCode;
    const userName = req.query.loggedInUserId;
    const userRealName = req.query.loggedInUserNickName;
    let conn;
    try {
        conn = await oracledb.getConnection(dbConfig);

        // 게시글 정보 가져오기
        const result = await conn.execute(
            `SELECT * FROM boarder WHERE boarder_code = :boarderCode`,
            [boarderCode],
            { fetchInfo: { CONTENT: { type: oracledb.STRING } } }
        );

        const post = {
            id: result.rows[0][0],
            title: result.rows[0][2],
            content: result.rows[0][4],
            // image_path: result.rows[0][7],
            // image_name: result.rows[0][8]
        };
        console.log(post.id);

        res.render('ej_editPost', {
            post: post,
            userId: userId,
            username: userName,
            userRealName: userRealName
        });
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
router.post('/:boarderCode', async (req, res) => {
    const { title, content } = req.body;
    const boarderCode= req.params.boarderCode;

    let conn;
    try {
        conn = await oracledb.getConnection(dbConfig);

        // 게시글 수정
        await conn.execute(
            `UPDATE boarder SET title = :title, content = :content WHERE boarder_code = :boarderCode`,
            [title, content, boarderCode]
        );

        // 변경 사항 커밋
        await conn.commit();

        // 수정 후 상세 페이지로 리다이렉트
        res.redirect(`/ej_detailPost/${boarderCode}?user_id=${req.session.loggedInUserCode}&username=${req.session.loggedInUserId}&user_realname=${req.session.loggedInUserNickName}`);
    } catch (err) {
        console.error('게시글 수정 중 오류 발생:', err);
        res.status(500).send('게시글 수정 중 오류가 발생했습니다.');
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