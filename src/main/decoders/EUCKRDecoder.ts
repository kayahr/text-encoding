/*
 * Copyright (C) 2021 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import euckr from "../../../data/euc-kr.cp.js";
import { AbstractDecoder } from "../AbstractDecoder.js";
import { ByteBuffer, END_OF_BUFFER } from "../ByteBuffer.js";
import { FINISHED } from "../constants.js";
import { inRange, isASCII } from "../util.js";

/**
 * Decoder for euc-kr encoding.
 */
export class EUCKRDecoder extends AbstractDecoder {
    private lead = 0x00;

    /** @inheritDoc */
    public decode(buffer: ByteBuffer): number | number[] | null {
        const byte = buffer.read();
        if (byte === END_OF_BUFFER && this.lead !== 0) {
            this.lead = 0x00;
            return this.fail();
        }
        if (byte === END_OF_BUFFER && this.lead === 0) {
            return FINISHED;
        }
        if (this.lead !== 0x00) {
            const lead = this.lead;
            let index: number | null = null;
            this.lead = 0x00;
            if (inRange(byte, 0x41, 0xFE)) {
                index = (lead - 0x81) * 190 + (byte - 0x41);
            }
            const codePoint = (index == null) ? null : euckr[index] ?? null;
            if (index == null && isASCII(byte)) {
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
