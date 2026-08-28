/*
 * Copyright (C) 2021 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { describe, it } from "node:test";
import { assertEquals, assertSame } from "@kayahr/assert";
import * as exports from "../main/index.ts";
import { TextDecoder } from "../main/TextDecoder.ts";
import { TextEncoder, createTextEncoder } from "../main/TextEncoder.ts";
import { ENCODINGS } from "./util/encodings.ts";

describe("index", () => {
    it("exports the public API", () => {
        assertEquals({ ...exports }, { TextDecoder, TextEncoder, createTextEncoder });
    });
    describe("supports encoding", () => {
        for (const encoding of ENCODINGS) {
            it(encoding, () => {
                assertSame(new TextEncoder(encoding).encoding, encoding);
                assertSame(new TextDecoder(encoding).encoding, encoding);
            });
        }
    });
});
