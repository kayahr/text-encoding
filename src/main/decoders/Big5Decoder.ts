/*
 * Copyright (C) 2021 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import big5 from "../../../data/big5.cp.js";
import { AbstractDecoder } from "../AbstractDecoder.js";
import { ByteBuffer, END_OF_BUFFER } from "../ByteBuffer.js";
import { FINISHED } from "../constants.js";
import { inRange, isASCII } from "../util.js";

/**
 * Decoder for big5 encoding.
 */
export class Big5Decoder extends AbstractDecoder {
    private lead = 0x00;

    /** @inheritDoc */
    public decode(buffer: ByteBuffer): number | number[] | null {
        const byte = buffer.read();
        if (byte === END_OF_BUFFER && this.lead !== 0x00) {
            this.lead = 0x00;
            return this.fail();
        }
        if (byte === END_OF_BUFFER && this.lead === 0x00) {
            return FINISHED;
        }
        if (this.lead !== 0x00) {
            const lead = this.lead;
            this.lead = 0x00;
            const offset = byte < 0x7F ? 0x40 : 0x62;
            let index: number | null = null;
            if (inRange(byte, 0x40, 0x7E) || inRange(byte, 0xA1, 0xFE)) {
                index = (lead - 0x81) * 157 + (byte - offset);
            }
            switch (index) {
                case 1133: return [ 0x00CA, 0x0304 ];
                case 1135: return [ 0x00CA, 0x030C ];
                case 1164: return [ 0x00EA, 0x0304 ];
                case 1166: return [ 0x00EA, 0x030C ];
                case null:
                default:
            }
            const codePoint = (index == null) ? null : big5[index] ?? null;
            if (codePoint == null && isASCII(byte)) {
                buffer.write(byte);
            }
            return codePoint ?? this.fail();
        }
        if (isASCII(byte)) {
            return byte;
        }
        if (inRange(byte, 0x81, 0xFE)) {
            this.lead = byte;
            return null;
        }
        return this.fail();
    }
}
