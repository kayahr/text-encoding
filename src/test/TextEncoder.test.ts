/*
 * Copyright (C) 2021 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import "../main/encodings.ts";

import { describe, it } from "node:test";

import { TextEncoder, createTextEncoder } from "../main/TextEncoder.ts";
import eucjp from "./data/euc-jp-decoded.ts";
import euckr from "./data/euc-kr-decoded.ts";
import gb18030PUAMappings from "./data/gb18030-pua-mappings.ts";
import gbk from "./data/gbk-decoded.ts";
import shiftJIS from "./data/shift_jis-decoded.ts";
import { readData } from "./util/readData.ts";
import { assertEquals, assertSame, assertThrowWithMessage } from "@kayahr/assert";

const UTF8_ENCODING = [ "utf-8" ];
const SINGLE_BYTE_ENCODINGS = [
    "ibm866", "iso-8859-2", "iso-8859-3", "iso-8859-4", "iso-8859-5", "iso-8859-6", "iso-8859-7", "iso-8859-8",
    "iso-8859-8-i", "iso-8859-10", "iso-8859-13", "iso-8859-14", "iso-8859-15", "iso-8859-16", "koi8-r", "koi8-u", "macintosh",
    "windows-874", "windows-1250", "windows-1251", "windows-1252", "windows-1253", "windows-1254", "windows-1255",
    "windows-1256", "windows-1257", "windows-1258", "x-mac-cyrillic", "x-user-defined"
];
const LEGACY_ENCODINGS = SINGLE_BYTE_ENCODINGS.filter(encoding => encoding !== "x-user-defined").concat([
    "gbk", "gb18030", "big5", "euc-jp", "iso-2022-jp", "shift_jis", "euc-kr", "utf-16le", "utf-16be"
]);
const ASCII_SUPERSETS = UTF8_ENCODING.concat(LEGACY_ENCODINGS).filter(e => e !== "utf-16le" && e !== "utf-16be");

describe("TextEncoder", () => {
    it("defaults to utf-8 encoding", () => {
        assertSame(new TextEncoder().encoding, "utf-8");
    });
    it("accepts encoding argument", () => {
        assertSame(new TextEncoder("utf-16le").encoding, "utf-16le");
    });
    describe("createTextEncoder", () => {
        const NativeTextEncoder = globalThis.TextEncoder;

        it("uses the native encoder for normalized UTF-8 labels", () => {
            for (const label of [
                "utf-8", "UTF-8", " utf-8 ", "utf8", "unicode-1-1-utf-8", "unicode11utf8", "unicode20utf8", "x-unicode20utf8"
            ]) {
                assertSame(createTextEncoder(label) instanceof NativeTextEncoder, true);
            }
        });
        it("uses the library encoder for legacy encodings", () => {
            const encoder = createTextEncoder("windows-1252");
            assertSame(encoder instanceof TextEncoder, true);
            assertSame(encoder.encoding, "windows-1252");
        });
        it("uses the library encoder when no native encoder exists", () => {
            try {
                Object.defineProperty(globalThis, "TextEncoder", { configurable: true, value: undefined });
                assertSame(createTextEncoder() instanceof TextEncoder, true);
            } finally {
                Object.defineProperty(globalThis, "TextEncoder", { configurable: true, value: NativeTextEncoder, writable: true });
            }
        });
    });
    it("accepts encoding names case-insensitively", () => {
        const encodings = [
            { label: "utf-8", encoding: "utf-8" },
            { label: "unicode11utf8", encoding: "utf-8" },
            { label: "unicode20utf8", encoding: "utf-8" },
            { label: "x-unicode20utf8", encoding: "utf-8" },
            { label: "utf-16", encoding: "utf-16le" },
            { label: "utf-16le", encoding: "utf-16le" },
            { label: "csunicode", encoding: "utf-16le" },
            { label: "iso-10646-ucs-2", encoding: "utf-16le" },
            { label: "ucs-2", encoding: "utf-16le" },
            { label: "unicode", encoding: "utf-16le" },
            { label: "unicodefeff", encoding: "utf-16le" },
            { label: "utf-16be", encoding: "utf-16be" },
            { label: "unicodefffe", encoding: "utf-16be" },
            { label: "csiso88598i", encoding: "iso-8859-8-i" },
            { label: "iso-8859-8-i", encoding: "iso-8859-8-i" },
            { label: "logical", encoding: "iso-8859-8-i" },
            { label: "ascii", encoding: "windows-1252" },
            { label: "iso8859-1", encoding: "windows-1252" },
            { label: "iso-8859-1", encoding: "windows-1252" }
        ];
        for (const encoding of encodings) {
            assertSame(new TextEncoder(encoding.label.toLowerCase()).encoding, encoding.encoding);
            assertSame(new TextEncoder(encoding.label.toUpperCase()).encoding, encoding.encoding);
        }
    });
    describe("encodeInto", () => {
        function assertResult(encoding: string, source: string, destinationSize: number, expectedRead: number,
                expectedBytes: number[]): void {
            const destination = new Uint8Array(destinationSize).fill(0xCC);
            const result = new TextEncoder(encoding).encodeInto(source, destination);
            assertEquals(result, { read: expectedRead, written: expectedBytes.length });
            assertEquals(destination.subarray(0, result.written), new Uint8Array(expectedBytes));
            assertEquals(destination.subarray(result.written), new Uint8Array(destinationSize - result.written).fill(0xCC));
        }

        describe("UTF-8", () => {
            it("counts UTF-16 code units", () => {
                assertResult("utf-8", "A💩B", 5, 3, [ 0x41, 0xF0, 0x9F, 0x92, 0xA9 ]);
            });
            it("does not split a multi-byte sequence", () => {
                assertResult("utf-8", "💩", 3, 0, []);
                assertResult("utf-8", "💩", 4, 2, [ 0xF0, 0x9F, 0x92, 0xA9 ]);
            });
            it("counts a lone surrogate as one code unit", () => {
                assertResult("utf-8", "\uD800A", 3, 1, [ 0xEF, 0xBF, 0xBD ]);
            });
        });
        describe("single-byte encodings", () => {
            it("encodes mapped non-ASCII characters", () => {
                assertResult("windows-1252", "€A", 1, 1, [ 0x80 ]);
            });
            for (const encoding of SINGLE_BYTE_ENCODINGS) {
                it(encoding, () => {
                    assertResult(encoding, "ABC", 4, 3, [ 0x41, 0x42, 0x43 ]);
                    assertResult(encoding, "ABC", 2, 2, [ 0x41, 0x42 ]);
                    assertResult(encoding, "A", 0, 0, []);
                });
            }
        });
        describe("multi-byte encodings", () => {
            it("UTF-16LE", () => {
                assertResult("utf-16le", "A", 1, 0, []);
                assertResult("utf-16le", "A💩B", 6, 3, [ 0x41, 0x00, 0x3D, 0xD8, 0xA9, 0xDC ]);
            });
            it("Shift_JIS", () => {
                assertResult("shift_jis", "\u306B", 1, 0, []);
                assertResult("shift_jis", "\u306B\u307B", 2, 1, [ 0x82, 0xC9 ]);
            });
            it("GB18030", () => {
                assertResult("gb18030", "💩", 3, 0, []);
                assertResult("gb18030", "💩A", 4, 2, [ 0x94, 0x39, 0xDA, 0x33 ]);
            });
            it("does not inspect input after filling the destination", () => {
                assertResult("shift_jis", "A💩", 1, 1, [ 0x41 ]);
            });
        });
        describe("ISO-2022-JP", () => {
            const encodedJapaneseCharacter = [ 0x1B, 0x24, 0x42, 0x46, 0x7C, 0x1B, 0x28, 0x42 ];

            it("does not write an escape prefix without its character", () => {
                assertResult("iso-2022-jp", "\u65E5", 3, 0, []);
                assertResult("iso-2022-jp", "\u65E5", 5, 0, []);
            });
            it("writes a complete independently decodable source prefix", () => {
                assertResult("iso-2022-jp", "\u65E5A", 8, 1, encodedJapaneseCharacter);
                assertResult("iso-2022-jp", "\u65E5A", 9, 2, [ ...encodedJapaneseCharacter, 0x41 ]);
            });
            it("keeps the encoding state between accepted characters", () => {
                assertResult("iso-2022-jp", "\u65E5\u672C", 10, 2,
                    [ 0x1B, 0x24, 0x42, 0x46, 0x7C, 0x4B, 0x5C, 0x1B, 0x28, 0x42 ]);
            });
            it("starts each call in the ASCII state", () => {
                const encoder = new TextEncoder("iso-2022-jp");
                const japaneseDestination = new Uint8Array(8);
                assertEquals(encoder.encodeInto("\u65E5A", japaneseDestination), { read: 1, written: 8 });
                assertEquals(japaneseDestination, new Uint8Array(encodedJapaneseCharacter));
                const asciiDestination = new Uint8Array(1);
                assertEquals(encoder.encodeInto("A", asciiDestination), { read: 1, written: 1 });
                assertEquals(asciiDestination, new Uint8Array([ 0x41 ]));
            });
            it("starts encode calls with a fresh state after an error", () => {
                const encoder = new TextEncoder("iso-2022-jp");
                assertThrowWithMessage(() => encoder.encode("\u65E5💩"), TypeError, "The code point 128169 could not be encoded");
                assertEquals(encoder.encode("\u65E5"), new Uint8Array(encodedJapaneseCharacter));
            });
        });
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
    it("can encode regular Big5 characters", () => {
        assertEquals(new TextEncoder("big5").encode("\u4E00"), new Uint8Array([ 0xA4, 0x40 ]));
    });
    it("encodes ISO-8859-8-I with the ISO-8859-8 code page", () => {
        assertEquals(new TextEncoder("iso-8859-8-i").encode("\u00D7\u05D0"), new Uint8Array([ 0xAA, 0xE0 ]));
    });
    describe("encodes compatibility mappings with", () => {
        it("EUC-JP", () => {
            assertEquals(new TextEncoder("euc-jp").encode("\u00A5\u203E\uFF61\u2212"),
                new Uint8Array([ 0x5C, 0x7E, 0x8E, 0xA1, 0xA1, 0xDD ]));
        });
        it("Shift_JIS", () => {
            assertEquals(new TextEncoder("shift_jis").encode("\u00A5\u203E\uFF61\u2212"),
                new Uint8Array([ 0x5C, 0x7E, 0xA1, 0x81, 0x7C ]));
        });
        it("ISO-2022-JP", () => {
            assertEquals(new TextEncoder("iso-2022-jp").encode("\u00A5A\u203E"),
                new Uint8Array([ 0x1B, 0x28, 0x4A, 0x5C, 0x41, 0x7E, 0x1B, 0x28, 0x42 ]));
            assertEquals(new TextEncoder("iso-2022-jp").encode("\u00A5\\\u00A5~"), new Uint8Array([
                0x1B, 0x28, 0x4A, 0x5C, 0x1B, 0x28, 0x42, 0x5C,
                0x1B, 0x28, 0x4A, 0x5C, 0x1B, 0x28, 0x42, 0x7E
            ]));
            assertEquals(new TextEncoder("iso-2022-jp").encode("\u2212"),
                new Uint8Array([ 0x1B, 0x24, 0x42, 0x21, 0x5D, 0x1B, 0x28, 0x42 ]));
        });
    });
    it("can encode the GBK Euro extension", () => {
        assertEquals(new TextEncoder("gbk").encode("\u20AC"), new Uint8Array([ 0x80 ]));
    });
    it("can encode the first GB18030 range entry", () => {
        assertEquals(new TextEncoder("gb18030").encode("\u0080"), new Uint8Array([ 0x81, 0x30, 0x81, 0x30 ]));
    });
    describe("rejects unrepresentable characters with", () => {
        for (const encoding of [ "big5", "euc-jp", "euc-kr", "gbk", "windows-1252", "x-user-defined" ]) {
            it(encoding, () => {
                assertThrowWithMessage(() => new TextEncoder(encoding).encode("💩"), TypeError,
                    "The code point 128169 could not be encoded");
            });
        }
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
    describe("encodes GB18030-2005 private-use compatibility mappings with", () => {
        for (const encoding of [ "gbk", "gb18030" ]) {
            it(encoding, () => {
                const encoder = new TextEncoder(encoding);
                for (const mapping of gb18030PUAMappings) {
                    assertEquals(encoder.encode(String.fromCodePoint(mapping.legacy)), new Uint8Array(mapping.encoded));
                }
            });
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
    describe("rejects characters not representable in Shift_JIS", () => {
        for (const codePoint of [ 0x1F4A9, 0x20AC, 0xFFFD, 0xE000 ]) {
            it(`U+${codePoint.toString(16).toUpperCase()}`, () => {
                assertThrowWithMessage(() => new TextEncoder("shift_jis").encode(String.fromCodePoint(codePoint)), TypeError,
                    `The code point ${codePoint} could not be encoded`);
            });
        }
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
    it("maps halfwidth Katakana when encoding iso-2022-jp", () => {
        assertEquals(new TextEncoder("iso-2022-jp").encode("\uFF61\uFF76\uFF9E\uFF9F"), new Uint8Array([
            0x1B, 0x24, 0x42, 0x21, 0x23, 0x25, 0x2B, 0x21, 0x2B, 0x21, 0x2C, 0x1B, 0x28, 0x42
        ]));
    });
});
