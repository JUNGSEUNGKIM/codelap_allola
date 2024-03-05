const express = require('express');
const oracledb = require('oracledb');
const dbConfig = require('../dbConfig');
const bodyParser = require("body-parser");

const router = express.Router();



router.get('/', async (req, res) => {



    const loggedInUserCode = req.session.loggedInUserCode;
    const loggedInUserNickName = req.session.loggedInUserNickName;
    const loggedInUserId = req.session.loggedInUserId;
    console.log(`username: ${loggedInUserCode}`);

    try {
        conn = await oracledb.getConnection(dbConfig);
        let result = await conn.execute(
            `select location from mount group by location order by location`
        );
        const totalPosts = result.rows;

        if(req.query.location){
            console.log(req.query.location);
            const address = req.query.location;
            let page = await conn.execute(
                'select count(*) from mount where location=:address'
                ,{address}
            )
            const totalMaps = page.rows[0];
            console.log("totalMap::"+totalMaps);
            const postsPerPage = 21; // 한 페이지에 표시할 게시글 수
            const totalPages = Math.ceil(totalMaps / postsPerPage); // 총 페이지 수 계산

            let currentPage = req.query.page ? parseInt(req.query.page) : 1; // 현재 페이지 번호
            const startRow = (currentPage - 1) * postsPerPage + 1;
            console.log("startRow:::"+startRow)
            const endRow = currentPage * postsPerPage;
            console.log("startRow:::"+endRow)

            let searchCondition = ''; // 기본적으로 검색 조건 없음

            result = await conn.execute(
                'with numbered_mount as (select mount_name, mount_code, st_x, st_y, row_number() over (order by mount_name) as rn from mount where location=:address) select mount_name, mount_code,st_x,st_y from numbered_mount where rn between :startRow and :endRow'
                ,{address,startRow, endRow}
            );
            const mountName = result.rows;

            const MAX_PAGE_LIMIT = 5;
            let startPage = (totalPages - currentPage) < MAX_PAGE_LIMIT ? totalPages - MAX_PAGE_LIMIT + 1 : currentPage;
            const endPage = Math.min(startPage + MAX_PAGE_LIMIT - 1, totalPages);
            const showPaging = totalPosts > postsPerPage;
            if(startPage < endPage){
                startPage=1;
            }
            // console.log("startPage ::: " + startPage + "endPage:::"+endPage);
            res.render('alloola_map',{
                loggedInUserNickName: loggedInUserNickName,
                totalPosts: totalPosts,
                mountName: mountName,
                startPage: startPage,
                currentPage: currentPage,
                endPage: endPage,
                totalPages: totalPages,
                maxPageNumber: MAX_PAGE_LIMIT,
                showPaging: showPaging
            } );
        }else {


            let page = await conn.execute(
                'select count(*) from mount'
            )
            const totalMaps = page.rows[0];
            console.log("totalMap::" + totalMaps);
            const postsPerPage = 21; // 한 페이지에 표시할 게시글 수
            const totalPages = Math.ceil(totalMaps / postsPerPage); // 총 페이지 수 계산

            let currentPage = req.query.page ? parseInt(req.query.page) : 1; // 현재 페이지 번호
            if(currentPage===0){currentPage=1}

            const startRow = (currentPage - 1) * postsPerPage + 1;
            console.log("startRow:::"+startRow)
            const endRow = currentPage * postsPerPage;
            console.log("startRow:::"+endRow)

            // 검색 조건에 따른 SQL 쿼리 작성
            let searchCondition = ''; // 기본적으로 검색 조건 없음

            result = await conn.execute(
                'with numbered_mount as (select mount_name, mount_code, st_x, st_y, row_number() over (order by mount_name) as rn from mount) select mount_name, mount_code,st_x,st_y from numbered_mount where rn between :startRow and :endRow'
                , {startRow, endRow}
            );
            const mountName = result.rows;

            const MAX_PAGE_LIMIT = 5;
            const startPage = (totalPages - currentPage) < MAX_PAGE_LIMIT ? totalPages - MAX_PAGE_LIMIT + 1 : currentPage;
            const endPage = Math.min(startPage + MAX_PAGE_LIMIT - 1, totalPages);
            res.render('alloola_map',{
                loggedInUserNickName: loggedInUserNickName,
                totalPosts: totalPosts,
                mountName: mountName,
                startPage: startPage,
                currentPage: currentPage,
                endPage: endPage,
                totalPages: totalPages,
                maxPageNumber: MAX_PAGE_LIMIT
            } );
        }


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


    // '/' 경로로의 요청은 Nginx에서 login.html을 처리하도록 리다이렉트

});

module.exports = router;