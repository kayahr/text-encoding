/*
 * Copyright (C) 2021 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { AbstractEncoder } from "../AbstractEncoder.js";
import { ByteBuffer, END_OF_BUFFER } from "../ByteBuffer.js";
import { FINISHED } from "../constants.js";
import { inRange, isASCII } from "../util.js";

/**
 * Encoder for utf-8 encoding.
 */
export class UTF8Encoder extends AbstractEncoder {
    /** @inheritDoc */
    public encode(buffer: ByteBuffer): number | number[] {
        const codePoint = buffer.read();
        if (codePoint === END_OF_BUFFER) {
            return FINISHED;
        }
        if (isASCII(codePoint)) {
            return codePoint;
        }
        let count: number;
        let offset: number;
        if (inRange(codePoint, 0x0080, 0x07FF)) {
            count = 1;
            offset = 0xC0;
        } else if (inRange(codePoint, 0x0800, 0xFFFF)) {
            count = 2;
            offset = 0xE0;
        } else if (inRange(codePoint, 0x10000, 0x10FFFF)) {
            count = 3;
            offset = 0xF0;
        } else {
            return this.fail(codePoint);
        }
        const bytes = [ (codePoint >> (6 * count)) + offset ];
        while (count > 0) {
            const temp = codePoint >> (6 * (count - 1));
            bytes.push(0x80 | (temp & 0x3F));
            count -= 1;
        }
        return bytes;
    }
}
