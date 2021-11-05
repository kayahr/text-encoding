/*
 * Copyright (C) 2021 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { AbstractEncoder } from "../AbstractEncoder";
import { ByteBuffer, END_OF_BUFFER } from "../ByteBuffer";
import { FINISHED } from "../constants";
import { inRange, isASCII } from "../util";

/**
 * Encoder for x-user-defined encoding.
 */
export class XUserDefinedEncoder extends AbstractEncoder {
    /** @inheritDoc */
    public encode(buffer: ByteBuffer): number | number[] {
        const codePoint = buffer.read();
        if (codePoint === END_OF_BUFFER) {
            return FINISHED;
        }
        if (isASCII(codePoint)) {
            return codePoint;
        }
        if (inRange(codePoint, 0xF780, 0xF7FF)) {
            return codePoint - 0xF780 + 0x80;
        }
        return this.fail(codePoint);
    }
}
