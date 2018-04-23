var fs = require('fs');
var read_buffer = Buffer(4096);

function read_last_n_lines(filename, n, callback) {
    fs.readFile(filename, "utf-8", (err, data) => {
        if (err) {
            callback(err);
            return;
        }

        var content = data.split("\n");
        var last_lines = content;
        if (content.length >= n) {
            var content_start = content.length - n;
            last_lines = content.slice(content_start-1);
        }

        callback(null, last_lines.join("\n"));
    })
}

function tail(filename, n, callback) {
    read_last_n_lines(filename, n, (err, data) => {
        if (err) {
            callback(err, null);
        }
        callback(null, data);
    });

    fs.open(filename, 'r', function (err, fd) {
        if (err) {
            callback(err, null);
        }

        fs.watchFile(filename, function(curr, prev) {
            var changed_content_len = curr.size - prev.size;
            var position_changed = changed_content_len > 0;
            var position = prev.size;
            if (position_changed) {
                fs.read(fd, read_buffer, 0, changed_content_len, position, function(err, bytesRead, buffer) {
                    if (err) {
                        callback(err, null);
                        return;
                    }
                    callback(null, buffer.toString("utf-8", 0, bytesRead));
                })
            }
        })
    })
}

module.exports = tail;
