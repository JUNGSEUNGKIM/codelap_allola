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
    const userId = req.session.loggedInUserCode;
    const userName = req.session.loggedInUserId;
    const userRealName = req.session.loggedInUserNickName;
    console.log(`username: ${userName}`);
    let conn;
    try {
        conn = await oracledb.getConnection(dbConfig);

        // 조회수 증가 처리
        // await conn.execute(
        //     `UPDATE customshop SET views = views + 1 WHERE boarder_code = :boarderCode`,
        //     [boarderCode]
        // );

        // 좋아요 수 증가
        // await conn.execute(
        //     `UPDATE boarder SET = views + 1 WHERE boarder_code = :boarderCode`,
        //     [boarderCode]
        // );

        // 변경 사항을 커밋
        // await conn.commit();

        // 게시글 정보 가져오기
        const postResult = await conn.execute(
            `SELECT b.boarder_code, b.title, u.nickname AS author, b.content, 
                    b.likes, b.FILE_ORIGINAL_NAME, b.FILE_STORED_NAME,b.price 
            FROM customshop b
            JOIN user_table u ON b.user_code = u.user_code
            WHERE b.boarder_code = :boarderCode`,
            [boarderCode],
            { fetchInfo: { CONTENT: { type: oracledb.STRING } } }
        );

        // 댓글 가져오기
        const commentResult = await conn.execute(
            `SELECT bc.id, bc.user_code, bc.content, u.nickname AS author, TO_CHAR(bc.created_at, 'YYYY-MM-DD') AS created_at, bc.parent_comment_id 
            FROM customshop_comments bc
            JOIN user_table u ON bc.user_code = u.user_code
            WHERE bc.boarder_code = :boarderCode
            ORDER BY bc.id`,
            [boarderCode],
            { fetchInfo: { CONTENT: { type: oracledb.STRING } } }
        );

        // 댓글과 댓글의 댓글을 구성
        const comments = [];
        const commentMap = new Map(); // 댓글의 id를 key로 하여 댓글을 맵으로 저장

        commentResult.rows.forEach(row => {
            const comment = {
                id: row[0],
                user_code: row[1],
                content: row[2],
                nickname: row[3],
                created_at: row[4],
                children: [], // 자식 댓글을 저장할 배열
                // isAuthor: row[2] === userRealName // 댓글 작성자가 현재 로그인한 사용자인지 확인
            };

            const parentId = row[5]; // 부모 댓글의 id

            if (parentId === null) {
                // 부모 댓글이 null이면 바로 댓글 배열에 추가
                comments.push(comment);
                commentMap.set(comment.id, comment); // 맵에 추가
            } else {
                // 부모 댓글이 있는 경우 부모 댓글을 찾아서 자식 댓글 배열에 추가
                const parentComment = commentMap.get(parentId);
                parentComment.children.push(comment);
            }
        });
        // console.log(postResult.rows[0]);
        const post = {
            id: postResult.rows[0][0],
            title: postResult.rows[0][1],
            author: postResult.rows[0][2],
            content: postResult.rows[0][3],
            // created_at: postResult.rows[0][4],
            // views: postResult.rows[0][5],
            likes: postResult.rows[0][4],
            imageName: postResult.rows[0][5],
            imagePath: postResult.rows[0][6],
            price: postResult.rows[0][7]
        };
        // console.log(postResult.rows[0][8]);

        // console.log(`post: ${post}, comments: ${comments}`);
        // console.log(`id: ${postResult.rows[0][0]}, content: ${postResult.rows[0][2]},
        //  imgaepath: ${postResult.rows[0][8]}`);
        res.render('customshop_detailPost', {
            post: post,
            userId: userId,
            username: userName,
            userRealName: userRealName,
            comments: comments
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



module.exports = router;