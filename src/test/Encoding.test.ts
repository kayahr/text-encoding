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
