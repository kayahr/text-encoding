/*
 * Copyright (C) 2021 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { AbstractDecoder } from "../AbstractDecoder.js";
import { ByteBuffer, END_OF_BUFFER } from "../ByteBuffer.js";
import { FINISHED } from "../constants.js";
import { inRange } from "../util.js";

/**
 * Decoder for utf-8 encoding.
 */
export class UTF8Decoder extends AbstractDecoder {
    private codePoint = 0;
    private bytesSeen = 0;
    private bytesNeeded = 0;
    private lowerBoundary = 0x80;
    private upperBoundary = 0xBF;

    /** @inheritDoc */
    public decode(buffer: ByteBuffer): number | number[] | null {
        const byte = buffer.read();
        if (byte === END_OF_BUFFER && this.bytesNeeded !== 0) {
            this.bytesNeeded = 0;
            return this.fail();
        }
        if (byte === END_OF_BUFFER) {
            return FINISHED;
        }
        if (this.bytesNeeded === 0) {
            if (inRange(byte, 0x00, 0x7F)) {
                return byte;
            } else if (inRange(byte, 0xC2, 0xDF)) {
                this.bytesNeeded = 1;
                this.codePoint = byte & 0x1F;
            } else if (inRange(byte, 0xE0, 0xEF)) {
                if (byte === 0xE0) {
                    this.lowerBoundary = 0xA0;
                }
                if (byte === 0xED) {
                    this.upperBoundary = 0x9F;
                }
                this.bytesNeeded = 2;
                this.codePoint = byte & 0xF;
            } else if (inRange(byte, 0xF0, 0xF4)) {
                if (byte === 0xF0) {
                    this.lowerBoundary = 0x90;
                }
                if (byte === 0xF4) {
                    this.upperBoundary = 0x8F;
                }
                this.bytesNeeded = 3;
                this.codePoint = byte & 0x7;
            } else {
                return this.fail();
            }
            return null;
        }
        if (!inRange(byte, this.lowerBoundary, this.upperBoundary)) {
            this.codePoint = this.bytesNeeded = this.bytesSeen = 0;
            this.lowerBoundary = 0x80;
            this.upperBoundary = 0xBF;
            buffer.write(byte);
            return this.fail();
        }
        this.lowerBoundary = 0x80;
        this.upperBoundary = 0xBF;
        this.codePoint = (this.codePoint << 6) | (byte & 0x3F);
        this.bytesSeen += 1;
        if (this.bytesSeen !== this.bytesNeeded) {
            return null;
        }
        const codePoint = this.codePoint;
        this.codePoint = this.bytesNeeded = this.bytesSeen = 0;
        return codePoint;
    }
}
