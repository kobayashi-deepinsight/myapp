var express = require('express');
var router = express.Router();
var utils = require('../utils/utils.js');

/* サンプルAPI①
 * http://localhost:3000/samples にGETメソッドのリクエストを投げると、
 * JSON形式で文字列を返す。
 */
router.get('/', function(req, res, next) {
    var param = { "値": "これはサンプルAPIです" };
    res.header('Content-Type', 'application/json; charset=utf-8');
    res.send(param);
});

/* サンプルAPI②
 * http://localhost:3000/samples/hello にGETメソッドのリクエストを投げると、
 * JSON形式で文字列を返す。
 */
router.get('/hello', function(req, res, next) {
    var param = { "result": "Hello World !" };
    res.header('Content-Type', 'application/json; charset=utf-8');
    res.send(param);
});

/*
 * http://localhost:3000/samples/list にGETメソッドのリクエストを投げると、
 * JSON形式で文字列を返す。
 */
router.get('/list', function(req, res, next) {
    rtn = [];
    rtn = utils.diretoryTreeToObj("music", function(err, obj) {
        if (err)
            console.error(err);
        res.header('Content-Type', 'application/json; charset=utf-8');
        res.send(obj);
    });
});

module.exports = router;
