AutoBuffer自动处理buffer数据的工具！

安装

```javascript
npm install AutoBuffer
```

测试用例
```javascript
var AutoBuffer = require('./AutoBuffer');
/**
 * 构造函数参数说明，默认使用低位进行计算
 * littleEndian true|false  低位
 * bigEndian    true|false  高位
 * sign true|false  无符号，默认有符号
 * buffer   需要解包的buffer数据
 * noAssert true|false  是否验证数值和偏移
 */


/************************************8位测试**********************************************/
var buf = new AutoBuffer().int8(125).pack();//或者byte(125)

console.log(buf);

var data = new AutoBuffer({
    "buffer": buf
}).int8().unpack();

console.log(data);


/************************************16位测试**********************************************/
var buf = new AutoBuffer({
    "bigEndian": true
}).int16(32700).pack();//或者byte(125)

console.log(buf);

var data = new AutoBuffer({
    "bigEndian": true,
    "buffer": buf
}).int16().unpack();

console.log(data);

/************************************32位测试**********************************************/
var buf = new AutoBuffer({
    "littleEndian": true
}).int32(327012020).pack();//或者byte(125)

console.log(buf);

var data = new AutoBuffer({
    "littleEndian": true,
    "buffer": buf
}).int32().unpack();

console.log(data);


/************************************64位测试**********************************************/
var buf = new AutoBuffer({
    "littleEndian": true
}).int64(42323322555).pack();

console.log(buf);

var data = new AutoBuffer({
    "littleEndian": true,
    "buffer": buf
}).int64().unpack();

console.log(data);

/************************************字符串测试**********************************************/
var buf = new AutoBuffer().string(0, "你好hello").pack();

console.log(buf);

var data = new AutoBuffer({
    "buffer": buf
}).string(11).unpack();

console.log(data);

/************************************混合测试**********************************************/
var buf = new AutoBuffer().int8(125).int16(32700).string(0, "你好hello")
    .int32(327012020).int64(42323322555).pack();

console.log(buf);

var data = new AutoBuffer({
    "buffer": buf
}).int8().int16().string(11).int32().int64().unpack();

console.log(data);
```
