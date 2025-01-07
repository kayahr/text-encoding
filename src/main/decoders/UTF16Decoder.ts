/*
 * Copyright (C) 2021 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { AbstractDecoder } from "../AbstractDecoder.js";
import { ByteBuffer, END_OF_BUFFER } from "../ByteBuffer.js";
import { FINISHED } from "../constants.js";
import { convertCodeUnitToBytes, inRange } from "../util.js";

/**
 * Base class for UTF-16 decoders.
 */
export abstract class UTF16Decoder extends AbstractDecoder {
    private readonly bigEndian: boolean;
    private leadByte: number | null = null;
    private leadSurrogate: number | null = null;

    /**
     * @param bigEndian - True for utf-16be, false for utf-16le.
     * @param fatal     - True to throw an exception when a character can't be decoded. False to decode to a
     *                    replacement character instead.
     */
    public constructor(bigEndian: boolean, fatal?: boolean) {
        super(fatal);
        this.bigEndian = bigEndian;
    }

    /** @inheritDoc */
    public decode(buffer: ByteBuffer): number | number[] | null {
        const byte = buffer.read();
        if (byte === END_OF_BUFFER && (this.leadByte !== null || this.leadSurrogate !== null)) {
            return this.fail();
        }
        if (byte === END_OF_BUFFER && this.leadByte == null && this.leadSurrogate == null) {
            return FINISHED;
        }
        if (this.leadByte == null) {
            this.leadByte = byte;
            return null;
        }
        let codeUnit: number;
        if (this.bigEndian) {
            codeUnit = (this.leadByte << 8) + byte;
        } else {
            codeUnit = (byte << 8) + this.leadByte;
        }
        this.leadByte = null;
        if (this.leadSurrogate !== null) {
            const leadSurrogate = this.leadSurrogate;
            this.leadSurrogate = null;
            if (inRange(codeUnit, 0xDC00, 0xDFFF)) {
                return 0x10000 + (leadSurrogate - 0xD800) * 0x400 + (codeUnit - 0xDC00);
            }
            buffer.write(...convertCodeUnitToBytes(codeUnit, this.bigEndian));
            return this.fail();
        }
        if (inRange(codeUnit, 0xD800, 0xDBFF)) {
            this.leadSurrogate = codeUnit;
            return null;
        }
        if (inRange(codeUnit, 0xDC00, 0xDFFF)) {
            return this.fail();
        }
        return codeUnit;
    }
}

/**
 * Decoder for utf-16le encoding.
 */
export class UTF16LEDecoder extends UTF16Decoder {
    /** @inheritDoc */
    public constructor(fatal?: boolean) {
        super(false, fatal);
    }
}

/**
 * Decoder for utf-16be encoding.
 */
export class UTF16BEDecoder extends UTF16Decoder {
    /** @inheritDoc */
    public constructor(fatal?: boolean) {
        super(true, fatal);
    }
}
