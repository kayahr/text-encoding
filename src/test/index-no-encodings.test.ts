/*
 * Copyright (C) 2021 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { describe, it } from "node:test";
import { assertEquals, assertSame, assertThrowWithMessage } from "@kayahr/assert";
import * as exports from "../main/index-no-encodings.ts";
import { TextDecoder } from "../main/TextDecoder.ts";
import { TextEncoder, createTextEncoder } from "../main/TextEncoder.ts";
import { ENCODINGS } from "./util/encodings.ts";

describe("index-no-encodings", () => {
    it("exports the public API", () => {
        assertEquals({ ...exports }, { TextDecoder, TextEncoder, createTextEncoder });
    });
    describe("supports encoding", () => {
        it("utf-8", () => {
            assertSame(new TextEncoder("utf-8").encoding, "utf-8");
            assertSame(new TextDecoder("utf-8").encoding, "utf-8");
        });
    });
    describe("does not support encoding", () => {
        for (const encoding of ENCODINGS.filter(encoding => encoding !== "utf-8")) {
            it(encoding, () => {
                assertThrowWithMessage(() => new TextEncoder(encoding), RangeError, `Encoding not supported: ${encoding}`);
                assertThrowWithMessage(() => new TextDecoder(encoding), RangeError, `Encoding not supported: ${encoding}`);
            });
        }
    });
});
