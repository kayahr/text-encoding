/*
 * Copyright (C) 2021 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import * as euckr from "../../../data/euc-kr.cp.json";
import { AbstractEncoder } from "../AbstractEncoder";
import { ByteBuffer, END_OF_BUFFER } from "../ByteBuffer";
import { FINISHED } from "../constants";
import { indexOf, isASCII } from "../util";

/**
 * Encoder for euc-kr encoding.
 */
export class EUCKREncoder extends AbstractEncoder {
    /** @inheritDoc */
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
