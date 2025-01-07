/*
 * Copyright (C) 2021 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import big5 from "../../../data/big5.cp.js";
import { AbstractEncoder } from "../AbstractEncoder.js";
import { ByteBuffer, END_OF_BUFFER } from "../ByteBuffer.js";
import { FINISHED } from "../constants.js";
import { indexOf, isASCII } from "../util.js";

/**
 * Returns the index for the given code point.
 *
 * @param codePoint - The code point to search for.
 * @return The found index or null if not found.
 */
function getIndex(codePoint: number): number | null {
    big5WithoutHKSCs = big5WithoutHKSCs ?? big5.map((codePoint, index) =>
        ((index < (0xA1 - 0x81) * 157) ? null : codePoint)
    );
    const index = big5WithoutHKSCs;
    if (codePoint === 0x2550 || codePoint === 0x255E || codePoint === 0x2561 || codePoint === 0x256A
            || codePoint === 0x5341 || codePoint === 0x5345) {
        return index.lastIndexOf(codePoint);
    }
    return indexOf(index, codePoint);
}
let big5WithoutHKSCs: Array<number | null> | null = null;

/**
 * Encoder for big5 encoding.
 */
export class Big5Encoder extends AbstractEncoder {
    /** @inheritDoc */
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
        if (lead < 0xA1) {
            return this.fail(codePoint);
        }
        const trail = index % 157;
        const offset = trail < 0x3F ? 0x40 : 0x62;
        return [ lead, trail + offset ];
    }
}
