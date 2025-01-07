/*
 * Copyright (C) 2021 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import jis0208 from "../../../data/jis0208.cp.js";
import jis0212 from "../../../data/jis0212.cp.js";
import { AbstractDecoder } from "../AbstractDecoder.js";
import { ByteBuffer, END_OF_BUFFER } from "../ByteBuffer.js";
import { FINISHED } from "../constants.js";
import { inRange, isASCII } from "../util.js";

/**
 * Decoder for euc-jp encoding.
 */
export class EUCJPDecoder extends AbstractDecoder {
    private jis0212Flag = false;
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
        if (this.lead === 0x8E && inRange(byte, 0xA1, 0xDF)) {
            this.lead = 0x00;
            return 0xFF61 - 0xA1 + byte;
        }
        if (this.lead === 0x8F && inRange(byte, 0xA1, 0xFE)) {
            this.jis0212Flag = true;
            this.lead = byte;
            return null;
        }
        if (this.lead !== 0x00) {
            const lead = this.lead;
            this.lead = 0x00;
            let codePoint: number | null = null;
            if (inRange(lead, 0xA1, 0xFE) && inRange(byte, 0xA1, 0xFE)) {
                codePoint = (this.jis0212Flag ? jis0212 : jis0208)[(lead - 0xA1) * 94 + (byte - 0xA1)] ?? null;
            }
            this.jis0212Flag = false;
            if (!inRange(byte, 0xA1, 0xFE)) {
                buffer.write(byte);
            }
            return codePoint ?? this.fail();
        }
        if (isASCII(byte)) {
            return byte;
        }
        if (byte === 0x8E || byte === 0x8F || inRange(byte, 0xA1, 0xFE)) {
            this.lead = byte;
            return null;
        }
        return this.fail();
    }
}
