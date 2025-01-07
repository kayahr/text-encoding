/*
 * Copyright (C) 2021 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { AbstractEncoder } from "../AbstractEncoder.js";
import { ByteBuffer, END_OF_BUFFER } from "../ByteBuffer.js";
import { FINISHED } from "../constants.js";
import { convertCodeUnitToBytes, inRange } from "../util.js";

/**
 * Base class for utf-16 encoders.
 */
export abstract class UTF16Encoder extends AbstractEncoder {
    private readonly bigEndian: boolean;

    /**
     * @param bigEndian - True for utf-16be, false for utf-16le
     */
    protected constructor(bigEndian: boolean) {
        super();
        this.bigEndian = bigEndian;
    }

    /** @inheritDoc */
    public encode(buffer: ByteBuffer): number | number[] {
        const codePoint = buffer.read();
        if (codePoint === END_OF_BUFFER) {
            return FINISHED;
        }
        if (inRange(codePoint, 0x0000, 0xFFFF)) {
            return convertCodeUnitToBytes(codePoint, this.bigEndian);
        }
        const lead = convertCodeUnitToBytes(((codePoint - 0x10000) >> 10) + 0xD800, this.bigEndian);
        const trail = convertCodeUnitToBytes(((codePoint - 0x10000) & 0x3FF) + 0xDC00, this.bigEndian);
        return lead.concat(trail);
    }
}

/**
 * Encoder for utf-16le encoding.
 */
export class UTF16LEEncoder extends UTF16Encoder {
    /** @inheritDoc */
    public constructor() {
        super(false);
    }
}

/**
 * Encoder for utf-16be encoding.
 */
export class UTF16BEEncoder extends UTF16Encoder {
    /** @inheritDoc */
    public constructor() {
        super(true);
    }
}
