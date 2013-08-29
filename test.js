/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 13-8-28
 * Time: 下午2:22
 * To change this template use File | Settings | File Templates.
 */
var AB = require('./AutoBuffer');

var buf = new AB({
    "bigEndian": false
});

var d = buf.int8(10).int32(1222).string(0, "abcd").int32(10).pack();
console.log(d);

var buf2 = new AB({
    "bigEndian": false,
    "buffer": d
});
console.log(buf2.int8().int32().string(4).int32().unpack());


