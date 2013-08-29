/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 13-8-28
 * Time: 下午1:34
 * To change this template use File | Settings | File Templates.
 */

var INT8 = 1;
var INT16 = 2;
var INT32 = 3;
var INT64 = 4;
var STRING = 5;

var AutoBuffer = function(opts) {
    this._littleEndian = !!(opts && opts.littleEndian);
    this._bigEndian = !!(opts && opts.bigEndian);
    this._endian = this._littleEndian ? "LE" : (this._bigEndian ? "BE" : "LE");
    this._sign = opts && opts.sign ? "U" : "";
    this._buf = opts && opts.buffer && Buffer.isBuffer(opts.buffer) ? opts.buffer : null;
    this._noAssert = !!(opts && opts.noAssert);
    this._list = [];
    this._offset = 0;
};

AutoBuffer.prototype.data = function(value, types, sizes, reader, writer) {
    var st = {
        val: value,
        type: types,
        size: sizes
    };
    var bit = this._sign;
    switch (types) {
        case INT8:
            bit += "Int8";
            break;
        case INT16:
            bit += "Int16";
            break;
        case INT32:
            bit += "Int32";
            break;
        case INT64:
            bit += "Int64";
            break;
        case STRING:
            bit += "String";
            reader = this["readString"];
            writer = this["writeString"];
            st.rm = 'readString';
            st.wm = 'writeString';
            break;
        default :
            throw new Error("undefined type.");
            break;
    }
    if (types != INT8) {
        bit += this._endian;
    }
    st.rm = (st.rm == undefined) ? 'read' + bit : st.rm;
    st.wm = (st.wm == undefined) ? 'read' + bit : st.wm;
    st.read = (reader == undefined) ? Buffer.prototype['read' + bit] : reader;
    st.write = (writer == undefined) ? Buffer.prototype['write' + bit] : writer;
    return st;
};

AutoBuffer.prototype.littleEndian = function() {
    this._littleEndian = true;
    this._endian = "LE";
    return this;
};

AutoBuffer.prototype.bigEndian = function() {
    this._bigEndian = true;
    this._endian = "BE";
    return this;
};

AutoBuffer.prototype.sign = function() {
    this._sign = "U";
    return this;
};

AutoBuffer.prototype.byte = AutoBuffer.prototype.int8 = function(val, index) {
    var d = this.data(val, 1, 1);
    if (val == undefined || val == null) {
        this._list.push(d.read.apply(this._buf, [this._offset, this._noAssert]));
    } else {
        this._list.splice((index != undefined ? index : this._list.length), 0, d);
    }
    this._offset += d.size;
    return this;
};

AutoBuffer.prototype.int16 = function(val, index) {
    var d = this.data(val, 2, 2);
    if (val == undefined || val == null) {
        this._list.push(d.read.apply(this._buf, [this._offset, this._noAssert]));
    } else {
        this._list.splice((index != undefined ? index : this._list.length), 0, d);
    }
    this._offset += d.size;
    return this;
};

AutoBuffer.prototype.int32 = function(val, index) {
    var d = this.data(val, 3, 4);
    if (val == undefined || val == null) {
        this._list.push(d.read.apply(this._buf, [this._offset, this._noAssert]));
    } else {
        this._list.splice((index != undefined ? index : this._list.length), 0, d);
    }
    this._offset += d.size;
    return this;
};

AutoBuffer.prototype.string = function(len, val, index) {
    var d = this.data(val, 5, 0);
    if (val == undefined || val == null) {
        if ((typeof len == 'number') && len > 0) {
            d.size = len;
            this._list.push(d.read.apply(this, [this._offset, len]));
        }
    } else {
        if (typeof val == 'string') {
            var strBuffer = new Buffer(val);
            d.size = strBuffer.length;
            this._list.splice((index != undefined ? index : this._list.length), 0, d);
        }
    }
    this._offset += d.size;
    return this;
};

AutoBuffer.prototype.readString = function(offset, len) {
    var buf = this._buf.slice(offset, offset + len);
    return buf.toString();
};

AutoBuffer.prototype.writeString = function(str, offset) {
    var buf = new Buffer(str);
    buf.copy(this._buf, offset);
};

AutoBuffer.prototype.write = AutoBuffer.prototype.pack = function() {
    this._buf = new Buffer(this._offset);
    var offset = 0;
    for (var i = 0; i < this._list.length; i++) {
        writeImpl = this._list[i].write;
        if (writeImpl) {
            if (this[this._list[i].wm]) {
                writeImpl.apply(this, [this._list[i].val, offset, this._noAssert]);
            } else {
                writeImpl.apply(this._buf, [this._list[i].val, offset, this._noAssert]);
            }
        }
        offset += this._list[i].size;
    }
    return this._buf;
};

AutoBuffer.prototype.read = AutoBuffer.prototype.unpack = function() {
    if (this._buf == null) {
        return null;
    }
    return this._list;
};

AutoBuffer.prototype.append = function(buf1, buf2) {
    if (!Buffer.isBuffer(buf1) || !Buffer.isBuffer(buf2)) {
        throw new Error("two arguments must be Buffer.");
        return;
    }
    var len = buf1.length + buf2.length;
    var buf = new Buffer(len);
    buf1.copy(buf);
    buf2.copy(buf, buf1.length);
    return buf;
};

module.exports = exports = AutoBuffer;