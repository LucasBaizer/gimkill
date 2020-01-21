module.exports = class Decoder {
	/**
	 * @param {Buffer} view
	 */
	constructor(view) {
		this.offset = 1;
		this.view = view;
	}

	str(e) {
		var t = function (e, t, n) {
			for (var r = "", a = 0, c = t, o = t + n; c < o; c++) {
				var i = e.readUInt8(c);
				if (0 !== (128 & i)) {
					if (192 !== (224 & i)) {
						if (224 !== (240 & i)) {
							if (240 !== (248 & i)) {
								throw new Error("Invalid byte " + i.toString(16));
							}
							(a = (7 & i) << 18 | (63 & e.readUInt8(++c)) << 12 | (63 & e.readUInt8(++c)) << 6 | (63 & e.readUInt8(++c)) << 0) >= 65536 ? (a -= 65536,
								r += String.fromCharCode(55296 + (a >>> 10), 56320 + (1023 & a))) : r += String.fromCharCode(a)
						} else {
							r += String.fromCharCode((15 & i) << 12 | (63 & e.readUInt8(++c)) << 6 | (63 & e.readUInt8(++c)) << 0);
						}
					} else {
						r += String.fromCharCode((31 & i) << 6 | 63 & e.readUInt8(++c));
					}
				} else {
					r += String.fromCharCode(i);
				}
			}
			return r
		}(this.view, this.offset, e);
		this.offset += e;
		return t;
	}

	array(e) {
		for (var t = new Array(e), n = 0; n < e; n++) {
			t[n] = this.parse();
		}
		return t;
	}

	map(e) {
		for (var t = {}, n = 0; n < e; n++) {
			t[this.parse()] = this.parse();
		}
		return t;
	}

	bin(e) {
		var t = this.buffer.slice(this.offset, this.offset + e);
		this.offset += e;
		return t;
	}

	parse() {
		var e, t = this.view.readUInt8(this.offset++), n = 0, r = 0, a = 0, c = 0;
		if (t < 192) {
			return t < 128 ? t : t < 144 ? this.map(15 & t) : t < 160 ? this.array(15 & t) : this.str(31 & t);
		}
		if (t > 223)
			return -1 * (255 - t + 1);
		switch (t) {
			case 192:
				return null;
			case 194:
				return !1;
			case 195:
				return !0;
			case 196:
				return n = this.view.readUInt8(this.offset),
					this.offset += 1,
					this.bin(n);
			case 197:
				return n = this.view.readUInt16BE(this.offset),
					this.offset += 2,
					this.bin(n);
			case 198:
				return n = this.view.readUIntBE(this.offset),
					this.offset += 4,
					this.bin(n);
			case 199:
				return n = this.view.readUInt8(this.offset),
					r = this.view.readInt8(this.offset + 1),
					this.offset += 2,
					[r, this.bin(n)];
			case 200:
				return n = this.view.readUInt16BE(this.offset),
					r = this.view.readInt8(this.offset + 2),
					this.offset += 3,
					[r, this.bin(n)];
			case 201:
				return n = this.view.getUInt32(this.offset),
					r = this.view.getInt8(this.offset + 4),
					this.offset += 5,
					[r, this.bin(n)];
			case 202:
				return e = this.view.readFloatBE(this.offset), // float 32
					this.offset += 4,
					e;
			case 203:
				return e = this.view.readFloatBE(this.offset),
					this.offset += 8,
					e;
			case 204:
				return e = this.view.readUInt8(this.offset),
					this.offset += 1,
					e;
			case 205:
				return e = this.view.readUInt16BE(this.offset),
					this.offset += 2,
					e;
			case 206:
				return e = this.view.readUInt32BE(this.offset),
					this.offset += 4,
					e;
			case 207:
				return a = this.view.readUInt32BE(this.offset) * Math.pow(2, 32),
					c = this.view.readUInt32BE(this.offset + 4),
					this.offset += 8,
					a + c;
			case 208:
				return e = this.view.readInt8(this.offset),
					this.offset += 1,
					e;
			case 209:
				return e = this.view.readInt16BE(this.offset),
					this.offset += 2,
					e;
			case 210:
				return e = this.view.readInt32BE(this.offset),
					this.offset += 4,
					e;
			case 211:
				return a = this.view.readInt32BE(this.offset) * Math.pow(2, 32),
					c = this.view.readUInt32BE(this.offset + 4),
					this.offset += 8,
					a + c;
			case 212:
				return r = this.view.readInt8(this.offset),
					this.offset += 1,
					0 === r ? void (this.offset += 1) : [r, this.bin(1)];
			case 213:
				return r = this.view.readInt8(this.offset),
					this.offset += 1,
					[r, this.bin(2)];
			case 214:
				return r = this.view.readInt8(this.offset),
					this.offset += 1,
					[r, this.bin(4)];
			case 215:
				return r = this.view.readInt8(this.offset),
					this.offset += 1,
					0 === r ? (a = this.view.readInt32BE(this.offset) * Math.pow(2, 32),
						c = this.view.readUInt32BE(this.offset + 4),
						this.offset += 8,
						new Date(a + c)) : [r, this.bin(8)];
			case 216:
				return r = this.view.readInt8(this.offset),
					this.offset += 1,
					[r, this.bin(16)];
			case 217:
				return n = this.view.readUInt8(this.offset),
					this.offset += 1,
					this.str(n);
			case 218:
				return n = this.view.readUInt16BE(this.offset),
					this.offset += 2,
					this.str(n);
			case 219:
				return n = this.view.readUInt32BE(this.offset),
					this.offset += 4,
					this.str(n);
			case 220:
				return n = this.view.readUInt16BE(this.offset),
					this.offset += 2,
					this.array(n);
			case 221:
				return n = this.view.readUInt32BE(this.offset),
					this.offset += 4,
					this.array(n);
			case 222:
				return n = this.view.readUInt16BE(this.offset),
					this.offset += 2,
					this.map(n);
			case 223:
				return n = this.view.readUInt32BE(this.offset),
					this.offset += 4,
					this.map(n)
		}
		throw new Error("Could not parse");
	}
};