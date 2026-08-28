/*
 * Copyright (C) 2021 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import big5 from "../../../data/big5.cp.js";
import { AbstractEncoder } from "../AbstractEncoder.ts";
import { type ByteBuffer, END_OF_BUFFER } from "../ByteBuffer.ts";
import { FINISHED } from "../constants.ts";
import { isASCII } from "../util.ts";
import { CodePointIndex } from "./CodePointIndex.ts";

const BIG5_INDEX_START = (0xA1 - 0x81) * 157;
const BIG5_LAST_POINTER_CODE_POINTS = [ 0x2550, 0x255E, 0x2561, 0x256A, 0x5341, 0x5345 ] as const;

let big5Index: CodePointIndex | null = null;

/**
 * Returns the index for the given code point.
 *
 * @param codePoint - The code point to search for.
 * @returns The found index or null if not found.
 */
function getIndex(codePoint: number): number | null {
    if (big5Index == null) {
        big5Index = new CodePointIndex(big5, BIG5_INDEX_START);
        for (const lastPointerCodePoint of BIG5_LAST_POINTER_CODE_POINTS) {
            big5Index.setBMP(lastPointerCodePoint, big5.lastIndexOf(lastPointerCodePoint));
        }
    }
    return big5Index.get(codePoint);
}

/**
 * Encoder for big5 encoding.
 */
export class Big5Encoder extends AbstractEncoder {
    /** @inheritdoc */
    public encode(buffer: ByteBuffer): number | number[] {
        const codePoint = buffer.read();
        if (codePoint === END_OF_BUFFER) {
            return FINISHED;
        }
        if (isASCII(codePoint)) {
            return codePoint;
        }
        const index = getIndex(codePoint);
        if (index == null) {
            return this.fail(codePoint);
        }
        const lead = Math.floor(index / 157) + 0x81;
        const trail = index % 157;
        const offset = trail < 0x3F ? 0x40 : 0x62;
        return [ lead, trail + offset ];
    }
}
