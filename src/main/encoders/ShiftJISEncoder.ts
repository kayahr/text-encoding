/*
 * Copyright (C) 2021 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import jis0208 from "../../../data/jis0208.cp.js";
import { AbstractEncoder } from "../AbstractEncoder.js";
import { ByteBuffer, END_OF_BUFFER } from "../ByteBuffer.js";
import { FINISHED } from "../constants.js";
import { inRange, isASCII } from "../util.js";

/**
 * Returns the index for the given code point.
 *
 * @param codePoint - The code point to search for.
 * @return The found index or null if not found.
 */
function getIndex(codePoint: number): number | null {
    shiftJIS = shiftJIS ?? jis0208.map((codePoint, index) => (inRange(index, 8272, 8835) ? null : codePoint));
    return shiftJIS.indexOf(codePoint);
}
let shiftJIS: Array<number | number[] | null> | null = null;

/**
 * Encoder for shift_jis encoding.
 */
export class ShiftJISEncoder extends AbstractEncoder {
    /** @inheritDoc */
    public encode(buffer: ByteBuffer): number | number[] {
        let codePoint = buffer.read();
        if (codePoint === END_OF_BUFFER) {
            return FINISHED;
        }
        if (isASCII(codePoint) || codePoint === 0x0080) {
            return codePoint;
        }
        if (codePoint === 0x00A5) {
            return 0x5C;
        }
        if (codePoint === 0x203E) {
            return 0x7E;
        }
        if (inRange(codePoint, 0xFF61, 0xFF9F)) {
            return codePoint - 0xFF61 + 0xA1;
        }
        if (codePoint === 0x2212) {
            codePoint = 0xFF0D;
        }
        const index = getIndex(codePoint);
        if (index == null) {
            return this.fail(codePoint);
        }
        const lead = Math.floor(index / 188);

        const leadOffset = (lead < 0x1F) ? 0x81 : 0xC1;
        const trail = index % 188;
        const offset = (trail < 0x3F) ? 0x40 : 0x41;
        return [ lead + leadOffset, trail + offset ];
    }
}
