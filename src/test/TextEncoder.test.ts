/*
 * Copyright (C) 2021 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import "../main/encodings.ts";

import { describe, it } from "node:test";

import { TextEncoder } from "../main/TextEncoder.ts";
import eucjp from "./data/euc-jp-decoded.ts";
import euckr from "./data/euc-kr-decoded.ts";
import gbk from "./data/gbk-decoded.ts";
import shiftJIS from "./data/shift_jis-decoded.ts";
import { readData } from "./util/readData.ts";
import { assertEquals, assertSame, assertThrowWithMessage } from "@kayahr/assert";

const UTF8_ENCODING = [ "utf-8" ];
const LEGACY_ENCODINGS = [
    "ibm866", "iso-8859-2", "iso-8859-3", "iso-8859-4", "iso-8859-5", "iso-8859-6", "iso-8859-7", "iso-8859-8",
    "iso-8859-10", "iso-8859-13", "iso-8859-14", "iso-8859-15", "iso-8859-16", "koi8-r", "koi8-u", "macintosh",
    "windows-874", "windows-1250", "windows-1251", "windows-1252", "windows-1253", "windows-1254", "windows-1255",
    "windows-1256", "windows-1257", "windows-1258", "x-mac-cyrillic", "gbk", "gb18030", "big5", "euc-jp",
    "iso-2022-jp", "shift_jis", "euc-kr", "utf-16le", "utf-16be"
];
const ASCII_SUPERSETS = UTF8_ENCODING.concat(LEGACY_ENCODINGS).filter(e => e !== "utf-16le" && e !== "utf-16be");

describe("TextEncoder", () => {
    it("defaults to utf-8 encoding", () => {
        assertSame(new TextEncoder().encoding, "utf-8");
    });
    it("accepts encoding argument", () => {
        assertSame(new TextEncoder("utf-16le").encoding, "utf-16le");
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
            assertSame(new TextEncoder(encoding.label.toLowerCase()).encoding, encoding.encoding);
            assertSame(new TextEncoder(encoding.label.toUpperCase()).encoding, encoding.encoding);
        }
    });
    describe("encodes supersets of ASCII correctly:", () => {
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
                const encoded = new TextEncoder(encoding).encode(string);
                assertSame(new TextDecoder().decode(encoded), string);
            });
        }
    });
    it("can encode big5", () => {
        assertEquals(Array.from(new TextEncoder("big5").encode("\u2550\u255E\u2561\u256A\u5341\u5345")),
            [ 249, 249, 249, 233, 249, 235, 249, 234, 164, 81, 164, 202 ]);
    });
    it("can encode gb18030", () => {
        const tests = [
            { encoded: [ 148, 57, 218, 51 ], decoded: "\uD83D\uDCA9" },
            { encoded: [ 0xA8, 0xBC, 0x81, 0x35, 0xF4, 0x37 ], decoded: "\u1E3F\uE7C7" }
        ];
        for (const test of tests) {
            assertEquals(new TextEncoder("gb18030").encode(test.decoded), new Uint8Array(test.encoded));
        }
    });
    it("throws error when encoding U+E5E5 with gb18030", () => {
        assertThrowWithMessage(() => new TextEncoder("gb18030").encode("\uE5E5"), TypeError, "The code point 58853 could not be encoded");
    });
    it("can encode gbk", async () => {
        const encoded = await readData("gbk-encoded.txt");
        assertEquals(new TextEncoder("gbk").encode(gbk), encoded);
    });
    it("can encode shift_jis", async () => {
        assertEquals(new TextEncoder("shift_jis").encode(shiftJIS), await readData("shift_jis-encoded.txt"));
        assertEquals(new TextEncoder("shift_jis").encode("\u306B\u307B\u3093"),
                new Uint8Array([ 0x82, 0xC9, 0x82, 0xD9, 0x82, 0xF1 ])); // Nihon)
    });
    it("can encode euc-jp", async () => {
        const encoded = await readData("euc-jp-encoded.txt");
        assertEquals(new TextEncoder("euc-jp").encode(eucjp), encoded);
    });
    it("can encode euc-kr", async () => {
        const encoded = await readData("euc-kr-encoded.txt");
        assertEquals(new TextEncoder("euc-kr").encode(euckr), encoded);
    });
    it("can encode x-user-defined", () => {
        const encoder = new TextEncoder("x-user-defined");
        for (let i = 0; i < 0x80; ++i) {
            assertEquals(encoder.encode(String.fromCharCode(i)), new Uint8Array([ i ]));
            assertEquals(encoder.encode(String.fromCharCode(i + 0xF780)), new Uint8Array([ i + 0x80 ]));
        }
    });
    describe("can encode", () => {
        for (const encoding of [ "utf-8", "utf-16le", "utf-16be", "utf-16" ]) {
            describe(encoding, () => {
                it("with sample string", () => {
                    const sample = "z\xA2\u6C34\uD834\uDD1E\uDBFF\uDFFD";
                    assertSame(new TextDecoder(encoding).decode(new TextEncoder(encoding).encode(sample)), sample);
                });
                function codePointName(n: number): string {
                    if (n + 0 !== n) {
                        return n.toString();
                    }
                    const w = (n <= 0xFFFF) ? 4 : 6;
                    return `U+${(`000000${n.toString(16).toUpperCase()}`).slice(-w)}`;
                }
                function generateBlock(from: number, len: number, skip: number): string {
                    const block = [];
                    for (let i = 0; i < len; i += skip) {
                        let cp = from + i;
                        if (cp >= 0xD800 && cp <= 0xDFFF) {
                            continue;
                        }
                        if (cp < 0x10000) {
                            block.push(String.fromCharCode(cp));
                            continue;
                        }
                        cp -= 0x10000;
                        block.push(String.fromCharCode(0xD800 + (cp >> 10)));
                        block.push(String.fromCharCode(0xDC00 + (cp & 0x3FF)));
                    }
                    return block.join("");
                }
                const minCodePoint = 0;
                const maxCodePoint = 0x10FFFF;
                const blockSize = 0x1000;
                const skipSize = 31;
                const encoder = new TextEncoder(encoding);
                const decoder = new TextDecoder(encoding);
                for (let i = minCodePoint; i < maxCodePoint; i += blockSize) {
                    const blockTag = `${codePointName(i)} - ${codePointName(i + blockSize - 1)}`;
                    it(`with unicode block ${blockTag}`, () => {
                        const block = generateBlock(i, blockSize, skipSize);
                        assertSame(decoder.decode(encoder.encode(block)), block);
                    });
                }
            });
        }
    });
    it("throws error when encoding U+00A5,U000E with iso-2022-jp", () => {
        assertThrowWithMessage(() => new TextEncoder("iso-2022-jp").encode("\u00A5\u000E"), TypeError, "The code point 65533 could not be encoded");
    });
});
