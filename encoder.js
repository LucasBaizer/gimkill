module.exports = class Encoder {
	postEncode(e, t, n) {
        for (var r = 0, a = 0, c = n.length; a < c; a++)
            (r = n.charCodeAt(a)) < 128 ? e.setUint8(t++, r) : r < 2048 ? (e.setUint8(t++, 192 | r >> 6),
            e.setUint8(t++, 128 | 63 & r)) : r < 55296 || r >= 57344 ? (e.setUint8(t++, 224 | r >> 12),
            e.setUint8(t++, 128 | r >> 6 & 63),
            e.setUint8(t++, 128 | 63 & r)) : (a++,
            r = 65536 + ((1023 & r) << 10 | 1023 & n.charCodeAt(a)),
            e.setUint8(t++, 240 | r >> 18),
            e.setUint8(t++, 128 | r >> 12 & 63),
            e.setUint8(t++, 128 | r >> 6 & 63),
            e.setUint8(t++, 128 | 63 & r))
	}
	
	encodeMessageBuffer(e) {
		return Buffer.concat([Buffer.from([0x04]), Buffer.from(this.encode(e))]);
	}

    encode(e) {
        var t = []
          , n = []
          , a = function e(t, n, r) {
            var a = typeof r
              , c = 0
              , o = 0
              , i = 0
              , l = 0
              , s = 0
              , u = 0;
            if ("string" === a) {
                if ((s = function(e) {
                    for (var t = 0, n = 0, r = 0, a = e.length; r < a; r++)
                        (t = e.charCodeAt(r)) < 128 ? n += 1 : t < 2048 ? n += 2 : t < 55296 || t >= 57344 ? n += 3 : (r++,
                        n += 4);
                    return n
                }(r)) < 32)
                    t.push(160 | s),
                    u = 1;
                else if (s < 256)
                    t.push(217, s),
                    u = 2;
                else if (s < 65536)
                    t.push(218, s >> 8, s),
                    u = 3;
                else {
                    if (!(s < 4294967296))
                        throw new Error("String too long");
                    t.push(219, s >> 24, s >> 16, s >> 8, s),
                    u = 5
                }
                return n.push({
                    str: r,
                    length: s,
                    offset: t.length
                }),
                u + s
            }
            if ("number" === a)
                return Math.floor(r) === r && isFinite(r) ? r >= 0 ? r < 128 ? (t.push(r),
                1) : r < 256 ? (t.push(204, r),
                2) : r < 65536 ? (t.push(205, r >> 8, r),
                3) : r < 4294967296 ? (t.push(206, r >> 24, r >> 16, r >> 8, r),
                5) : (i = r / Math.pow(2, 32) >> 0,
                l = r >>> 0,
                t.push(207, i >> 24, i >> 16, i >> 8, i, l >> 24, l >> 16, l >> 8, l),
                9) : r >= -32 ? (t.push(r),
                1) : r >= -128 ? (t.push(208, r),
                2) : r >= -32768 ? (t.push(209, r >> 8, r),
                3) : r >= -2147483648 ? (t.push(210, r >> 24, r >> 16, r >> 8, r),
                5) : (i = Math.floor(r / Math.pow(2, 32)),
                l = r >>> 0,
                t.push(211, i >> 24, i >> 16, i >> 8, i, l >> 24, l >> 16, l >> 8, l),
                9) : (t.push(203),
                n.push({
                    float: r,
                    length: 8,
                    offset: t.length
                }),
                9);
            if ("object" === a) {
                if (null === r)
                    return t.push(192),
                    1;
                if (Array.isArray(r)) {
                    if ((s = r.length) < 16)
                        t.push(144 | s),
                        u = 1;
                    else if (s < 65536)
                        t.push(220, s >> 8, s),
                        u = 3;
                    else {
                        if (!(s < 4294967296))
                            throw new Error("Array too large");
                        t.push(221, s >> 24, s >> 16, s >> 8, s),
                        u = 5
                    }
                    for (c = 0; c < s; c++)
                        u += e(t, n, r[c]);
                    return u
                }
                if (r instanceof Date) {
                    var h = r.getTime();
                    return i = Math.floor(h / Math.pow(2, 32)),
                    l = h >>> 0,
                    t.push(215, 0, i >> 24, i >> 16, i >> 8, i, l >> 24, l >> 16, l >> 8, l),
                    10
                }
                if (r instanceof ArrayBuffer) {
                    if ((s = r.byteLength) < 256)
                        t.push(196, s),
                        u = 2;
                    else if (s < 65536)
                        t.push(197, s >> 8, s),
                        u = 3;
                    else {
                        if (!(s < 4294967296))
                            throw new Error("Buffer too large");
                        t.push(198, s >> 24, s >> 16, s >> 8, s),
                        u = 5
                    }
                    return n.push({
                        bin: r,
                        length: s,
                        offset: t.length
                    }),
                    u + s
                }
                if ("function" === typeof r.toJSON)
                    return e(t, n, r.toJSON());
                var p = []
                  , f = ""
                  , d = Object.keys(r);
                for (c = 0,
                o = d.length; c < o; c++)
                    "function" !== typeof r[f = d[c]] && p.push(f);
                if ((s = p.length) < 16)
                    t.push(128 | s),
                    u = 1;
                else if (s < 65536)
                    t.push(222, s >> 8, s),
                    u = 3;
                else {
                    if (!(s < 4294967296))
                        throw new Error("Object too large");
                    t.push(223, s >> 24, s >> 16, s >> 8, s),
                    u = 5
                }
                for (c = 0; c < s; c++)
                    u += e(t, n, f = p[c]),
                    u += e(t, n, r[f]);
                return u
            }
            if ("boolean" === a)
                return t.push(r ? 195 : 194),
                1;
            if ("undefined" === a)
                return t.push(212, 0, 0),
                3;
            throw new Error("Could not encode")
        }(t, n, e)
          , c = new ArrayBuffer(a)
          , o = new DataView(c)
          , i = 0
          , l = 0
          , s = -1;
        n.length > 0 && (s = n[0].offset);
        for (var u, h = 0, p = 0, f = 0, d = t.length; f < d; f++)
            if (o.setUint8(l + f, t[f]),
            f + 1 === s) {
                if (h = (u = n[i]).length,
                p = l + s,
                u.bin)
                    for (var v = new Uint8Array(u.bin), m = 0; m < h; m++)
                        o.setUint8(p + m, v[m]);
                else
                    u.str ? this.postEncode(o, p, u.str) : void 0 !== u.float && o.setFloat64(p, u.float);
                l += h,
                n[++i] && (s = n[i].offset)
            }
        return c
    }
}