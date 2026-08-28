/*
 * Copyright (C) 2021 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { AbstractEncoder } from "../AbstractEncoder.ts";
import { type ByteBuffer, END_OF_BUFFER } from "../ByteBuffer.ts";
import { FINISHED } from "../constants.ts";
import { inRange, isASCII } from "../util.ts";
import { getShiftJISPointer } from "./JIS0208Index.ts";

/**
 * Encoder for shift_jis encoding.
 */
export class ShiftJISEncoder extends AbstractEncoder {
    /** @inheritdoc */
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
        const index = getShiftJISPointer(codePoint);
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
