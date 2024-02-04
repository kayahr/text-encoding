/*
 * Copyright (C) 2021 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import "../main/encodings";

import { TextDecoder } from "../main/TextDecoder";
import { TextEncoder } from "../main/TextEncoder";
import big5 from "./data/big5-decoded";
import eucjp from "./data/euc-jp-decoded";
import euckr from "./data/euc-kr-decoded";
import gbk from "./data/gbk-decoded";
import iso2022jp from "./data/iso-2022-jp-decoded";
import shiftJIS from "./data/shift_jis-decoded";
import { readData } from "./util/readData";

const utf8BOM = [ 0xEF, 0xBB, 0xBF ];
const utf8 = [ 0x7A, 0xC2, 0xA2, 0xE6, 0xB0, 0xB4, 0xF0, 0x9D, 0x84, 0x9E, 0xF4, 0x8F, 0xBF, 0xBD ];

const utf16leBOM = [ 0xff, 0xfe ];
const utf16le = [ 0x7A, 0x00, 0xA2, 0x00, 0x34, 0x6C, 0x34, 0xD8, 0x1E, 0xDD, 0xFF, 0xDB, 0xFD, 0xDF ];

const utf16beBOM = [ 0xfe, 0xff ];
const utf16be = [ 0x00, 0x7A, 0x00, 0xA2, 0x6C, 0x34, 0xD8, 0x34, 0xDD, 0x1E, 0xDB, 0xFF, 0xDF, 0xFD ];

// z, cent, CJK water, G-Clef, Private-use character
const utfSample = "z\xA2\u6C34\uD834\uDD1E\uDBFF\uDFFD";

const UTF8_ENCODING = [ "utf-8" ];
const LEGACY_ENCODINGS = [
    "ibm866", "iso-8859-2", "iso-8859-3", "iso-8859-4", "iso-8859-5", "iso-8859-6", "iso-8859-7", "iso-8859-8",
    "iso-8859-10", "iso-8859-13", "iso-8859-14", "iso-8859-15", "iso-8859-16", "koi8-r", "koi8-u", "macintosh",
    "windows-874", "windows-1250", "windows-1251", "windows-1252", "windows-1253", "windows-1254", "windows-1255",
    "windows-1256", "windows-1257", "windows-1258", "x-mac-cyrillic", "gbk", "gb18030", "big5", "euc-jp",
    "iso-2022-jp", "shift_jis", "euc-kr", "utf-16le", "utf-16be"
];
const ASCII_SUPERSETS = UTF8_ENCODING.concat(LEGACY_ENCODINGS).filter(e => e !== "utf-16le" && e !== "utf-16be");

describe("TextDecoder", () => {
    it("defaults to utf-8 encoding", () => {
        expect(new TextDecoder().encoding).toBe("utf-8");
    });
    it("accepts encoding argument", () => {
        expect(new TextDecoder("utf-16le").encoding).toBe("utf-16le");
    });
    it("accepts 'fatal' option", () => {
        expect(new TextDecoder("utf-8").fatal).toBe(false);
        expect(new TextDecoder("utf-8", { fatal: true }).fatal).toBe(true);
        expect(new TextDecoder("utf-8", { fatal: false }).fatal).toBe(false);
    });
    it("accepts 'ignoreBOM' option", () => {
        expect(new TextDecoder("utf-8").ignoreBOM).toBe(false);
        expect(new TextDecoder("utf-8", { ignoreBOM: true }).ignoreBOM).toBe(true);
        expect(new TextDecoder("utf-8", { ignoreBOM: false }).ignoreBOM).toBe(false);
    });
    it("handles bad strings", () => {
        const badStrings = [
            { input: "\ud800", expected: "\ufffd" }, // Surrogate half
            { input: "\udc00", expected: "\ufffd" }, // Surrogate half
            { input: "abc\ud800def", expected: "abc\ufffddef" }, // Surrogate half
            { input: "abc\udc00def", expected: "abc\ufffddef" }, // Surrogate half
            { input: "\udc00\ud800", expected: "\ufffd\ufffd" } // Wrong order
        ];
        for (const badString of badStrings) {
            const encoded = new TextEncoder().encode(badString.input);
            const decoded = new TextDecoder().decode(encoded);
            expect(decoded).toBe(badString.expected);
        }
    });
    it("throws exception on bad input when fatal flag is true", () => {
        const badInputs = [
            { encoding: "utf-8", input: [ 0xC0 ] }, // ends early
            { encoding: "utf-8", input: [ 0xC0, 0x00 ] }, // invalid trail
            { encoding: "utf-8", input: [ 0xC0, 0xC0 ] }, // invalid trail
            { encoding: "utf-8", input: [ 0xE0 ] }, // ends early
            { encoding: "utf-8", input: [ 0xE0, 0x00 ] }, // invalid trail
            { encoding: "utf-8", input: [ 0xE0, 0xC0 ] }, // invalid trail
            { encoding: "utf-8", input: [ 0xE0, 0x80, 0x00 ] }, // invalid trail
            { encoding: "utf-8", input: [ 0xE0, 0x80, 0xC0 ] }, // invalid trail
            { encoding: "utf-8", input: [ 0xFC, 0x80, 0x80, 0x80, 0x80, 0x80 ] }, // > 0x10FFFF
            { encoding: "utf-16le", input: [ 0x00 ] }, // truncated code unit
            { encoding: "utf-16le", input: [ 0x00, 0xd8 ] }, // surrogate half
            { encoding: "utf-16le", input: [ 0x00, 0xd8, 0x00, 0x00 ] }, // surrogate half
            { encoding: "utf-16le", input: [ 0x00, 0xdc, 0x00, 0x00 ] }, // trail surrogate
            { encoding: "utf-16le", input: [ 0x00, 0xdc, 0x00, 0xd8 ] }  // swapped surrogates
        ];
        for (const badInput of badInputs) {
            const encoded = new Uint8Array(badInput.input);
            expect(() => new TextDecoder(badInput.encoding, { fatal: true }).decode(encoded)).toThrow();
        }
    });
    it("accept encoding names case-insensitive", () => {
        const encodings = [
            { label: "utf-8", encoding: "utf-8" },
            { label: "utf-16", encoding: "utf-16le" },
            { label: "utf-16le", encoding: "utf-16le" },
            { label: "utf-16be", encoding: "utf-16be" },
            { label: "ascii", encoding: "windows-1252" },
            { label: "iso8859-1", encoding: "windows-1252" },
            { label: "iso-8859-1", encoding: "windows-1252" }
        ];
        for (const encoding of encodings) {
            expect(new TextDecoder(encoding.label.toLowerCase()).encoding).toBe(encoding.encoding);
            expect(new TextDecoder(encoding.label.toUpperCase()).encoding).toBe(encoding.encoding);
        }
    });
    describe("can stream-decode", () => {
        const string = "\x00123ABCabc\x80\xFF\u0100\u1000\uFFFD\uD800\uDC00\uDBFF\uDFFF";
        const cases = [
            {
                encoding: "utf-8",
                encoded: [
                    0, 49, 50, 51, 65, 66, 67, 97, 98, 99, 194, 128, 195, 191, 196,
                    128, 225, 128, 128, 239, 191, 189, 240, 144, 128, 128, 244, 143,
                    191, 191
                ]
            },
            {
                encoding: "utf-16le",
                encoded: [
                    0, 0, 49, 0, 50, 0, 51, 0, 65, 0, 66, 0, 67, 0, 97, 0, 98, 0,
                    99, 0, 128, 0, 255, 0, 0, 1, 0, 16, 253, 255, 0, 216, 0, 220,
                    255, 219, 255, 223
                ]
            },
            {
                encoding: "utf-16be",
                encoded: [
                    0, 0, 0, 49, 0, 50, 0, 51, 0, 65, 0, 66, 0, 67, 0, 97, 0, 98, 0,
                    99, 0, 128, 0, 255, 1, 0, 16, 0, 255, 253, 216, 0, 220, 0, 219,
                    255, 223, 255
                ]
            }
        ];
        for (const c of cases) {
            describe(c.encoding, () => {
                for (let len = 1; len <= 5; ++len) {
                    it(`with block size ${len}`, () => {
                        let out = "";
                        const decoder = new TextDecoder(c.encoding);
                        for (let i = 0; i < c.encoded.length; i += len) {
                            const sub = [];
                            for (let j = i; j < c.encoded.length && j < i + len; ++j) {
                                sub.push(c.encoded[j]);
                            }
                            out += decoder.decode(new Uint8Array(sub), { stream: true });
                        }
                        out += decoder.decode();
                        expect(out).toBe(string);
                    });
                }
            });
        }
    });
    describe("decodes supersets of ASCII correctly:", () => {
        for (const encoding of ASCII_SUPERSETS) {
            it(encoding, () => {
                let string = "";
                const bytes = [];
                for (let i = 0; i < 128; ++i) {
                    // Encodings that have escape codes in 0x00-0x7F
                    if (encoding === "iso-2022-jp" && (i === 0x0E || i === 0x0F || i === 0x1B)) {
                        continue;
                    }
                    string += String.fromCharCode(i);
                    bytes.push(i);
                }
                const asciiEncoded = new TextEncoder().encode(string);
                expect(new TextDecoder(encoding).decode(asciiEncoded)).toBe(string);
            });
        }
    });
    it("correctly handles non-fatal errors at EOF", () => {
        expect(() => new TextDecoder("utf-8", { fatal: true }).decode(new Uint8Array([ 0xff ]))).toThrow(TypeError);
        expect(new TextDecoder("utf-8").decode(new Uint8Array([ 0xff ]))).toBe("\uFFFD");
        expect(() => new TextDecoder("utf-16le", { fatal: true }).decode(new Uint8Array([ 0x00 ]))).toThrow(TypeError);
        expect(new TextDecoder("utf-16le").decode(new Uint8Array([ 0x00 ]))).toBe("\uFFFD");
        expect(() => new TextDecoder("utf-16be", { fatal: true }).decode(new Uint8Array([ 0x00 ]))).toThrow(TypeError);
        expect(new TextDecoder("utf-16be").decode(new Uint8Array([ 0x00 ]))).toBe("\uFFFD");
    });
    describe("throws RangeError for unsupported encodings:", () => {
        const badEncodings = [
            "csiso2022kr",
            "hz-gb-2312",
            "iso-2022-cn",
            "iso-2022-cn-ext",
            "iso-2022-kr",
            "klingon-1"
        ];
        for (const encoding of badEncodings) {
            it(encoding, () => {
                expect(() => new TextDecoder(encoding)).toThrow(RangeError);
            });
        }
    });
    it("can decode from an array buffer", () => {
        const bytes = [ 65, 66, 97, 98, 99, 100, 101, 102, 103, 104, 67, 68, 69, 70, 71, 72 ];
        const chars = "ABabcdefghCDEFGH";
        expect(new TextDecoder().decode(new Uint8Array(bytes).buffer)).toBe(chars);
    });
    describe("can decode from any typed array with and without buffer offsets:", () => {
        const bytes = [ 65, 66, 97, 98, 99, 100, 101, 102, 103, 104, 67, 68, 69, 70, 71, 72 ];
        const chars = "ABabcdefghCDEFGH";
        const buffer = new Uint8Array(bytes).buffer;
        const decoder = new TextDecoder();
        const types = [
            Uint8Array,
            Int8Array,
            Uint8ClampedArray,
            Uint16Array,
            Int16Array,
            Uint32Array,
            Int32Array,
            Float32Array,
            Float64Array
        ];
        for (const type of types) {
            it(type.name, () => {
                const array = new type(buffer);
                expect(decoder.decode(array)).toBe(chars);
                const bytes = type.BYTES_PER_ELEMENT;
                const subset = new type(buffer, bytes, 8 / bytes);
                expect(decoder.decode(subset)).toBe(chars.substring(bytes, bytes + 8));
            });
        }
    });
    it("can decode iso-2022-jp", async () => {
        const encoded = await readData("iso-2022-jp-encoded.txt");
        expect(new TextDecoder("iso-2022-jp",).decode(encoded)).toBe(iso2022jp);
    });
    it("can decode utf encodings with missing BOMs", () => {
        expect(new TextDecoder("utf-8").decode(new Uint8Array(utf8))).toBe(utfSample);
        expect(new TextDecoder("utf-16le").decode(new Uint8Array(utf16le))).toBe(utfSample);
        expect(new TextDecoder("utf-16be").decode(new Uint8Array(utf16be))).toBe(utfSample);
    });
    it("can decode utf encodings with matching BOMs", () => {
        expect(new TextDecoder("utf-8").decode(new Uint8Array(utf8BOM.concat(utf8)))).toBe(utfSample);
        expect(new TextDecoder("utf-16le").decode(new Uint8Array(utf16leBOM.concat(utf16le)))).toBe(utfSample);
        expect(new TextDecoder("utf-16be").decode(new Uint8Array(utf16beBOM.concat(utf16be)))).toBe(utfSample);
    });
    it("can decode utf-8 with splitted matching BOM", () => {
        const decoder = new TextDecoder("utf-8");
        expect(decoder.decode(new Uint8Array(utf8BOM.slice(0, 1)), { stream: true })).toBe("");
        expect(decoder.decode(new Uint8Array(utf8BOM.slice(1).concat(utf8)))).toBe(utfSample);
        expect(decoder.decode(new Uint8Array(utf8BOM.slice(0, 2)), { stream: true })).toBe("");
        expect(decoder.decode(new Uint8Array(utf8BOM.slice(2).concat(utf8)))).toBe(utfSample);
    });
    it("can decode utf-16le with splitted matching BOM", () => {
        const decoder = new TextDecoder("utf-16le");
        expect(decoder.decode(new Uint8Array(utf16leBOM.slice(0, 1)), { stream: true })).toBe("");
        expect(decoder.decode(new Uint8Array(utf16leBOM.slice(1).concat(utf16le)))).toBe(utfSample);
    });
    it("can decode utf-16be with splitted matching BOM", () => {
        const decoder = new TextDecoder("utf-16be");
        expect(decoder.decode(new Uint8Array(utf16beBOM.slice(0, 1)), { stream: true })).toBe("");
        expect(decoder.decode(new Uint8Array(utf16beBOM.slice(1).concat(utf16be)))).toBe(utfSample);
    });
    it("can not decode utf with mismatching BOMs", () => {
        expect(new TextDecoder("utf-8").decode(new Uint8Array(utf16leBOM.concat(utf8)))).not.toBe(utfSample);
        expect(new TextDecoder("utf-8").decode(new Uint8Array(utf16beBOM.concat(utf8)))).not.toBe(utfSample);
        expect(new TextDecoder("utf-16le").decode(new Uint8Array(utf8BOM.concat(utf16le)))).not.toBe(utfSample);
        expect(new TextDecoder("utf-16le").decode(new Uint8Array(utf16beBOM.concat(utf16le)))).not.toBe(utfSample);
        expect(new TextDecoder("utf-16be").decode(new Uint8Array(utf8BOM.concat(utf16be)))).not.toBe(utfSample);
        expect(new TextDecoder("utf-16be").decode(new Uint8Array(utf16leBOM.concat(utf16be)))).not.toBe(utfSample);
    });
    it("can decode utf with ignored BOM", () => {
        expect(new TextDecoder("utf-8", { ignoreBOM: true }).decode(
            new Uint8Array(utf8BOM.concat(utf8)))).toBe("\uFEFF" + utfSample);
        expect(new TextDecoder("utf-16le", { ignoreBOM: true }).decode(
            new Uint8Array(utf16leBOM.concat(utf16le)))).toBe("\uFEFF" + utfSample);
        expect(new TextDecoder("utf-16be", { ignoreBOM: true }).decode(
            new Uint8Array(utf16beBOM.concat(utf16be)))).toBe("\uFEFF" + utfSample);
    });
    it("can decode gbk", async () => {
        const encoded = await readData("gbk-encoded.txt");
        expect(new TextDecoder("gbk",).decode(encoded)).toBe(gbk);
    });
    it("can decode shift_jis", async () => {
        expect(new TextDecoder("shift_jis").decode(await readData("shift_jis-encoded.txt"))).toBe(shiftJIS);
        expect(new TextDecoder("shift_jis").decode(new Uint8Array([ 0x82, 0xC9, 0x82, 0xD9, 0x82, 0xF1 ])))
            .toBe("\u306B\u307B\u3093"); // Nihon);
    });
    it("can decode big5", async () => {
        const encoded = await readData("big5-encoded.txt");
        expect(new TextDecoder("big5").decode(encoded)).toBe(big5);
    });
    it("can decode euc-jp", async () => {
        const encoded = await readData("euc-jp-encoded.txt");
        expect(new TextDecoder("euc-jp").decode(encoded)).toBe(eucjp);
    });
    it("can decode euc-kr", async () => {
        const encoded = await readData("euc-kr-encoded.txt");
        expect(new TextDecoder("euc-kr").decode(encoded)).toBe(euckr);
    });
    it("can decode gb18030", () => {
        const tests = [
            { encoded: [ 148, 57, 218, 51 ], decoded: "\uD83D\uDCA9" },
            { encoded: [ 0xA8, 0xBC, 0x81, 0x35, 0xF4, 0x37 ], decoded: "\u1E3F\uE7C7" }
        ];
        for (const test of tests) {
            expect(new TextDecoder("gb18030").decode(new Uint8Array(test.encoded))).toBe(test.decoded);
        }
    });
    it("can decode x-user-defined", () => {
        const decoder = new TextDecoder("x-user-defined");
        for (let i = 0; i < 0x80; ++i) {
            expect(decoder.decode(new Uint8Array([ i ]))).toBe(String.fromCharCode(i));
            expect(decoder.decode(new Uint8Array([ i + 0x80 ]))).toBe(String.fromCharCode(i + 0xF780));
        }
    });
    it("can decode utf-8", () => {
        const encoded = [ 0x7A, 0xC2, 0xA2, 0xE6, 0xB0, 0xB4, 0xF0, 0x9D, 0x84, 0x9E, 0xF4, 0x8F, 0xBF, 0xBD ];
        expect(new TextDecoder("utf-8").decode(new Uint8Array(encoded))).toBe(utfSample);
    });
    it("can decode utf-16le", () => {
        const encoded = [ 0x7A, 0x00, 0xA2, 0x00, 0x34, 0x6C, 0x34, 0xD8, 0x1E, 0xDD, 0xFF, 0xDB, 0xFD, 0xDF ];
        expect(new TextDecoder("utf-16le").decode(new Uint8Array(encoded))).toBe(utfSample);
    });
    it("can decode utf-16", () => {
        const encoded = [ 0x7A, 0x00, 0xA2, 0x00, 0x34, 0x6C, 0x34, 0xD8, 0x1E, 0xDD, 0xFF, 0xDB, 0xFD, 0xDF ];
        expect(new TextDecoder("utf-16").decode(new Uint8Array(encoded))).toBe(utfSample);
    });
    it("can decode utf-16be", () => {
        const encoded = [ 0x00, 0x7A, 0x00, 0xA2, 0x6C, 0x34, 0xD8, 0x34, 0xDD, 0x1E, 0xDB, 0xFF, 0xDF, 0xFD ];
        expect(new TextDecoder("utf-16be").decode(new Uint8Array(encoded))).toBe(utfSample);
    });
    it("correctly maps 0xCA to U+05BA in windows-1255 encoding", () => {
        expect(new TextDecoder("windows-1255").decode(new Uint8Array([ 0xca ]))).toBe("\u05BA");
    });
    it("correctly decodes a very large input", () => {
        const data = new Uint16Array(1_000_000);
        data.fill(0x5400);
        const utf16 = new Uint8Array(data.buffer);
        const decoded = new TextDecoder("utf-16be").decode(utf16);
        expect(decoded.length).toBe(1_000_000);
        expect(decoded).toContain("TTTT");
    });
});
