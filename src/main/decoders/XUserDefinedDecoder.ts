/*
 * Copyright (C) 2021 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { AbstractDecoder } from "../AbstractDecoder.ts";
import { type ByteBuffer, END_OF_BUFFER } from "../ByteBuffer.ts";
import { FINISHED } from "../constants.ts";
import { isASCII } from "../util.ts";

/**
 * Decoder for x-user-defined encoding.
 */
export class XUserDefinedDecoder extends AbstractDecoder {
    /** @inheritdoc */
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
