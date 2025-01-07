/*
 * Copyright (C) 2021 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { AbstractDecoder } from "../AbstractDecoder.js";
import { ByteBuffer, END_OF_BUFFER } from "../ByteBuffer.js";
import { FINISHED } from "../constants.js";
import { isASCII } from "../util.js";

/**
 * Decoder for x-user-defined encoding.
 */
export class XUserDefinedDecoder extends AbstractDecoder {
    /** @inheritDoc */
    public decode(buffer: ByteBuffer): number | number[] | null {
        const byte = buffer.read();
        if (byte === END_OF_BUFFER) {
            return FINISHED;
        }
        if (isASCII(byte)) {
            return byte;
        }
        return 0xF780 + byte - 0x80;
    }
}
