/*
 * Copyright (C) 2021 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import jis0208 from "../../../data/jis0208.cp.js";
import { AbstractEncoder } from "../AbstractEncoder.js";
import { ByteBuffer, END_OF_BUFFER } from "../ByteBuffer.js";
import { FINISHED } from "../constants.js";
import { indexOf, inRange, isASCII } from "../util.js";

/**
 * Encoder for euc-jp encoding.
 */
export class EUCJPEncoder extends AbstractEncoder {
    /** @inheritDoc */
    public encode(buffer: ByteBuffer): number | number[] {
        let codePoint = buffer.read();
        if (codePoint === END_OF_BUFFER) {
            return FINISHED;
        }
        if (isASCII(codePoint)) {
            return codePoint;
        }
        if (codePoint === 0x00A5) {
            return 0x5C;
        }
        if (codePoint === 0x203E) {
            return 0x7E;
        }
        if (inRange(codePoint, 0xFF61, 0xFF9F)) {
            return [ 0x8E, codePoint - 0xFF61 + 0xA1 ];
        }
        if (codePoint === 0x2212) {
            codePoint = 0xFF0D;
        }
        const index = indexOf(jis0208, codePoint);
        if (index == null) {
            return this.fail(codePoint);
        }
        const lead = Math.floor(index / 94) + 0xA1;
        const trail = index % 94 + 0xA1;
        return [ lead, trail ];
    }
}
