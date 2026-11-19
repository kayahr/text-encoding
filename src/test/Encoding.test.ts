/*
 * Copyright (C) 2026 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import "../main/encodings.ts";

import { describe, it } from "node:test";
import { assertSame, assertThrowWithMessage } from "@kayahr/assert";
import { getEncoding } from "../main/Encoding.ts";

describe("Encoding", () => {
    describe("getEncoding", () => {
        it("accepts ASCII case differences and surrounding ASCII whitespace", () => {
            assertSame(getEncoding("\t\n\f\r UTF-8 \r\f\n\t").getName(), "utf-8");
        });
        it("accepts labels surrounded by long ASCII whitespace sequences", () => {
            const whitespace = "\t\n\f\r ".repeat(20_000);
            assertSame(getEncoding(`${whitespace}UTF-8${whitespace}`).getName(), "utf-8");
        });
        it("rejects labels containing a long internal tab sequence", () => {
            const label = `utf-8${"\t".repeat(100_000)}x`;
            assertThrowWithMessage(() => getEncoding(label), RangeError, /^Encoding not supported:/);
        });
        describe("rejects empty labels", () => {
            for (const label of [ "", "\t\n\f\r " ]) {
                it(JSON.stringify(label), () => {
                    assertThrowWithMessage(() => getEncoding(label), RangeError, `Encoding not supported: ${label}`);
                });
            }
        });
        describe("rejects non-ASCII case mappings in labels", () => {
            for (const label of [ "\u212Aoi8-r", "\u212Aoi8-u", "euc-\u212Ar" ]) {
                it(JSON.stringify(label), () => {
                    assertThrowWithMessage(() => getEncoding(label), RangeError, `Encoding not supported: ${label}`);
                });
            }
        });
        describe("rejects whitespace not allowed around labels", () => {
            for (const label of [
                "\vutf-8", "utf-8\v", "\u00A0utf-8", "utf-8\u00A0", "\u2003utf-8", "utf-8\u2003", "\uFEFFutf-8", "utf-8\uFEFF"
            ]) {
                it(JSON.stringify(label), () => {
                    assertThrowWithMessage(() => getEncoding(label), RangeError, `Encoding not supported: ${label}`);
                });
            }
        });
    });
});
