// ========= ディレクトリ構造をobjに ==========
var fs = require('fs');
var path = require('path');

var diretoryTreeToObj = function(dir, callback) {
    var results = [];
    fs.readdir(dir, function(err, list) {
        if (err)
            return callback(err);

        var pending = list.length;
        if (!pending)
            return callback(null, { name: path.basename(dir), type: 'folder', children: results });

        list.forEach(function(file) {
            file = path.resolve(dir, file);
            fs.stat(file, function(err, stat) {
                if (stat && stat.isDirectory()) {
                    diretoryTreeToObj(file, function(err, res) {
                        results.push({
                            type: 'folder',
                            name: path.basename(file),
                            children: res
                        });
                        if (!--pending)
                            callback(null, results);
                    });
                } else {
                    results.push({
                        type: 'file',
                        name: path.basename(file)
                    });
                    if (!--pending)
                        callback(null, results);
                }
            });
        });
    });
};

exports.diretoryTreeToObj = diretoryTreeToObj;


// =============== 自分のURLを取得 ===============
exports.getMyURL = function(req) {
    // console.log(req.protocol);
    // console.log(req.get('Host'));
    // console.log(req.originalUrl);
    return `${req.protocol}://${req.get('Host')}`;
};
