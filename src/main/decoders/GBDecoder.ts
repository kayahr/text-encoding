/*
 * Copyright (C) 2021 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import gb18030 from "../../../data/gb18030.cp.js";
import gb18030ranges from "../../../data/gb18030.ranges.js";
import { AbstractDecoder } from "../AbstractDecoder.js";
import { ByteBuffer, END_OF_BUFFER } from "../ByteBuffer.js";
import { FINISHED } from "../constants.js";
import { inRange, isASCII } from "../util.js";

/**
 * Returns the code point for the given gb18030 index.
 *
 * @param index - The index in the gb18030 code point table.
 * @return The code point corresponding to the given index.
 */
function getCodePoint(index: number): number | null {
    if ((index > 39419 && index < 189000) || (index > 1237575)) {
        return null;
    }
    if (index === 7457) {
        return 0xE7C7;
    }
    let offset = 0;
    let codePointOffset = 0;
    const idx = gb18030ranges;
    for (const entry of idx) {
        if (entry[0] > index) {
            break;
        }
        offset = entry[0];
        codePointOffset = entry[1];
    }
    return codePointOffset + index - offset;
}

/**
 * Decoder for gb18030 and gbk encoding.
 */
export class GBDecoder extends AbstractDecoder {
    private first = 0x00;
    private second = 0x00;
    private third = 0x00;

    /** @inheritDoc */
    public decode(buffer: ByteBuffer): number | number[] | null {
        const byte = buffer.read();
        if (byte === END_OF_BUFFER && this.first === 0x00 && this.second === 0x00 && this.third === 0x00) {
            return FINISHED;
        }
        if (byte === END_OF_BUFFER && (this.first !== 0x00 || this.second !== 0x00 || this.third !== 0x00)) {
            this.first = 0x00;
            this.second = 0x00;
            this.third = 0x00;
            return this.fail();
        }
        let codePoint: number | null;
        if (this.third !== 0x00) {
            codePoint = null;
            if (inRange(byte, 0x30, 0x39)) {
                codePoint = getCodePoint((((this.first - 0x81) * 10 + this.second - 0x30) * 126 + this.third - 0x81)
                    * 10 + byte - 0x30);
            }
            const bytes = [ this.second, this.third, byte ];
            this.first = 0x00;
            this.second = 0x00;
            this.third = 0x00;
            if (codePoint == null) {
                buffer.write(...bytes);
                return this.fail();
            }
            return codePoint;
        }
        if (this.second !== 0x00) {
            if (inRange(byte, 0x81, 0xFE)) {
                this.third = byte;
                return null;
            }
            buffer.write(this.second, byte);
            this.first = 0x00;
            this.second = 0x00;
            return this.fail();
        }
        if (this.first !== 0x00) {
            if (inRange(byte, 0x30, 0x39)) {
                this.second = byte;
                return null;
            }
            const lead = this.first;
            let index: number | null = null;
            this.first = 0x00;
            const offset = byte < 0x7F ? 0x40 : 0x41;
            if (inRange(byte, 0x40, 0x7E) || inRange(byte, 0x80, 0xFE)) {
                index = (lead - 0x81) * 190 + (byte - offset);
            }
            codePoint = index == null ? null : gb18030[index] ?? null;
            if (codePoint == null && isASCII(byte)) {
                buffer.write(byte);
            }
            return codePoint ?? this.fail();
        }
        if (isASCII(byte)) {
            return byte;
        }
        if (byte === 0x80) {
            return 0x20AC;
        }
        if (inRange(byte, 0x81, 0xFE)) {
            this.first = byte;
            return null;
        }
        return this.fail();
    }
}
