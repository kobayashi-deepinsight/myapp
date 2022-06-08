var express = require('express');
var router = express.Router();
const axios = require("axios");
const httpAdapter = require("axios/lib/adapters/http");
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
    hostURL = utils.getMyURL(req);
    var mp3_reg = /^.*\.mp3$/;
    utils.diretoryTreeToObj("music", function(err, obj) {
        if (err)
            console.error(err);
        rtn = [];
        obj.forEach(function(artist) {
            artist["children"].forEach(function(albam) {
                artworkUrl = `${hostURL}/${artist["name"]}/${albam["name"]}/artwork.jpg`;
                let rtnAlbamJson = {
                    name: albam["name"],
                    artist: artist["name"],
                    artwork: encodeURI(artworkUrl),
                    songNames: [],
                    songUrls: []
                };
                albam["children"].sort().forEach(function(file) {
                    if (file["name"].match(mp3_reg)) {
                        musicUrl = `${hostURL}/${artist["name"]}/${albam["name"]}/${file["name"]}`;
                        rtnAlbamJson["songNames"].push(file["name"]);
                        rtnAlbamJson["songUrls"].push(encodeURI(musicUrl));
                    }
                });
                rtn.push(rtnAlbamJson);
            });
        });
        res.header('Content-Type', 'application/json; charset=utf-8');
        res.send(rtn);
    });
});


module.exports = router;
