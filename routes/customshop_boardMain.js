const express = require('express');
const oracledb = require('oracledb');
const dbConfig = require('../dbConfig');

const router = express.Router();

router.get('/', async (req, res) => {


    let conn;

    const loggedInUserId = req.session.loggedInUserCode;
    const loggedInUserName = req.session.loggedInUserId;
    const loggedInUserRealName = req.session.loggedInUserNickName;
    try {
        conn = await oracledb.getConnection(dbConfig);
        let result = await conn.execute(
            `SELECT COUNT(*) AS total FROM customshop`
        );
        const totalPosts = result.rows[0];
        const postsPerPage = 6; // 한 페이지에 표시할 게시글 수
        const totalPages = Math.ceil(totalPosts / postsPerPage); // 총 페이지 수 계산

        let currentPage = req.query.page ? parseInt(req.query.page) : 1; // 현재 페이지 번호
        const startRow = (currentPage - 1) * postsPerPage + 1;
        const endRow = currentPage * postsPerPage;
        console.log(`startRow: ${startRow}, endRow: ${endRow}`);

        // 정렬 방식에 따른 SQL 쿼리 작성
        let orderByClause = 'ORDER BY b.boarder_code DESC'; // 기본적으로 최신순 정렬

        if (req.query.sort === 'views_desc') {
            orderByClause = 'ORDER BY b.views DESC'; // 조회수 내림차순, 최신순
        }

        // 검색 조건에 따른 SQL 쿼리 작성
        let searchCondition = ''; // 기본적으로 검색 조건 없음

        if (req.query.searchType && req.query.searchInput) {
            const searchType = req.query.searchType;
            const searchInput = req.query.searchInput;

            // 검색 조건에 따라 WHERE 절 설정
            if (searchType === 'title') {
                searchCondition = ` AND b.title LIKE '%${searchInput}%'`;
            } else if (searchType === 'content') {
                searchCondition = ` AND b.content LIKE '%${searchInput}%'`;
            } else if (searchType === 'author') {
                searchCondition = ` AND u.nickname LIKE '%${searchInput}%'`;
            }
        }



        result = await conn.execute(
            `
                SELECT
                    boarder_code,title,author,FILE_ORIGINAL_NAME, FILE_STORED_NAME, likes, price,
                    (SELECT COUNT(*) FROM customshop_comments bc WHERE bc.boarder_code = b.boarder_code) AS comments_count
                FROM (
                         SELECT
                             b.boarder_code, b.title, u.nickname AS author, b.FILE_ORIGINAL_NAME, b.FILE_STORED_NAME, b.likes, b.price,
                             ROW_NUMBER() OVER (${orderByClause}) AS rn
                         FROM customshop b
                                  JOIN user_table u ON b.user_code = u.user_code
                         WHERE 1=1
                             ${searchCondition}
                     ) b
                WHERE rn BETWEEN :startRow AND :endRow 
            `,
            {
                startRow: startRow,
                endRow: endRow
            }
        );

        const MAX_PAGE_LIMIT = 5;
        const startPage = Math.max(1, totalPages - MAX_PAGE_LIMIT + 1); // 최소값이 1이어야 함
        const endPage = Math.min(startPage + MAX_PAGE_LIMIT - 1, totalPages);
        const showPaging = totalPosts > postsPerPage;

        console.log(result.rows);

        res.render('customshop_index', {
            userId: loggedInUserId,
            userName: loggedInUserName,
            userRealName: loggedInUserRealName,
            posts: result.rows,
            startPage: startPage,
            currentPage: currentPage,
            endPage: endPage,
            totalPages: totalPages,
            maxPageNumber: MAX_PAGE_LIMIT,
            showPaging: showPaging
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