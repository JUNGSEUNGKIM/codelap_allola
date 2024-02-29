const express = require('express');
const oracledb = require('oracledb');
const dbConfig = require('../dbConfig');

const router = express.Router();
// deletePost 인 경우에 패스 정보가 있는데 이것은 명시적으로 입력해야 한다.
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

        // 게시글에 달린 댓글과 답글 삭제
        await conn.execute(
            `DELETE FROM boarder_comments WHERE boarder_code = :boarderCode OR parent_comment_id IN (SELECT id FROM boarder_comments WHERE boarder_code = :boarderCode)`,
            [boarderCode, boarderCode]
        );
        // 변경 사항 커밋
        await conn.commit();
        // 게시글 삭제
        await conn.execute(
            `DELETE FROM boarder WHERE boarder_code = :boarderCode`,
            [boarderCode]
        );

        // 변경 사항 커밋
        await conn.commit();

        // 삭제 후 게시판 메인 페이지로 리다이렉트
        res.redirect(`/ej_boardMain?id=${userId}&username=${userName}&name=${userRealName}`);
    } catch (err) {
        console.error('게시글 삭제 중 오류 발생:', err);
        res.status(500).send('게시글 삭제 중 오류가 발생했습니다.');
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