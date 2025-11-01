/*
 * Copyright (C) 2021 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import euckr from "../../../data/euc-kr.cp.js";
import { AbstractEncoder } from "../AbstractEncoder.ts";
import { type ByteBuffer, END_OF_BUFFER } from "../ByteBuffer.ts";
import { FINISHED } from "../constants.ts";
import { indexOf, isASCII } from "../util.ts";

/**
 * Encoder for euc-kr encoding.
 */
export class EUCKREncoder extends AbstractEncoder {
    /** @inheritdoc */
    public encode(buffer: ByteBuffer): number | number[] {
        const codePoint = buffer.read();
        if (codePoint === END_OF_BUFFER) {
            return FINISHED;
        }
        if (isASCII(codePoint)) {
            return codePoint;
        }
        const index = indexOf(euckr, codePoint);
        if (index == null) {
            return this.fail(codePoint);
        }
        const lead = Math.floor(index / 190) + 0x81;
        const trail = (index % 190) + 0x41;
        return [ lead, trail ];
    }
}
