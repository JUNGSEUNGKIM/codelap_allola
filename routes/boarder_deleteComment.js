const express = require('express');
const oracledb = require('oracledb');
const dbConfig = require('../dbConfig');

const router = express.Router();


router.post('/:id', async (req, res) => {
    const commentId = req.params.id;
    const boarderCode = req.body.boarderCode;

    let conn;
    try {
        conn = await oracledb.getConnection(dbConfig);

        // 댓글 삭제
        await conn.execute(
            `DELETE FROM boarder_comments WHERE id = :id OR parent_comment_id = :parent_comment_id`,
            { id: commentId, parent_comment_id: commentId }
        );

        // 변경 사항 커밋
        await conn.commit();

        // 삭제 후 상세 페이지로 리다이렉트
        res.redirect(`/boarder_detailPost/${boarderCode}`);
    } catch (err) {
        console.error('댓글 삭제 중 오류 발생:', err);
        res.status(500).send('댓글 삭제 중 오류가 발생했습니다.');
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
