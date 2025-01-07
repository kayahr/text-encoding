/*
 * Copyright (C) 2021 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import gb18030 from "../../../data/gb18030.cp.js";
import gb18030ranges from "../../../data/gb18030.ranges.js";
import { AbstractEncoder } from "../AbstractEncoder.js";
import { ByteBuffer, END_OF_BUFFER } from "../ByteBuffer.js";
import { FINISHED } from "../constants.js";
import { indexOf, isASCII } from "../util.js";

/**
 * Returns the index for the given code point.
 *
 * @param codePoint - The code point to search for.
 * @return The found index or null if not found.
 */
export function getIndex(codePoint: number): number {
    if (codePoint === 0xE7C7) {
        return 7457;
    }
    let offset = 0;
    let indexOffset = 0;
    const idx = gb18030ranges;
    for (const entry of idx) {
        if (entry[1] > codePoint) {
            break;
        }
        offset = entry[1];
        indexOffset = entry[0];
    }
    return indexOffset + codePoint - offset;
}

/**
 * Base class for gb18030 and gbk encoders.
 */
export abstract class GBEncoder extends AbstractEncoder {
    private readonly gbkFlag: boolean;

    /**
     * @param gbkFlag - True for gbk encoding, false for gb18030 encoding.
     */
    protected constructor(gbkFlag = false) {
        super();
        this.gbkFlag = gbkFlag;
    }

    /** @inheritDoc */
    public encode(buffer: ByteBuffer): number | number[] {
        const codePoint = buffer.read();
        if (codePoint === END_OF_BUFFER) {
            return FINISHED;
        }
        if (isASCII(codePoint)) {
            return codePoint;
        }
        if (codePoint === 0xE5E5) {
            return this.fail(codePoint);
        }
        if (this.gbkFlag && codePoint === 0x20AC) {
            return 0x80;
        }
        let index = indexOf(gb18030, codePoint);
        if (index !== null) {
            const lead = Math.floor(index / 190) + 0x81;
            const trail = index % 190;
            const offset = trail < 0x3F ? 0x40 : 0x41;
            return [ lead, trail + offset ];
        }
        if (this.gbkFlag) {
            return this.fail(codePoint);
        }
        index = getIndex(codePoint);
        const byte1 = Math.floor(index / 10 / 126 / 10);
        index = index - byte1 * 10 * 126 * 10;
        const byte2 = Math.floor(index / 10 / 126);
        index = index - byte2 * 10 * 126;
        const byte3 = Math.floor(index / 10);
        const byte4 = index - byte3 * 10;
        return [ byte1 + 0x81, byte2 + 0x30, byte3 + 0x81, byte4 + 0x30 ];
    }
}

/**
 * Encoder for gb18030 encoding.
 */
export class GB18030Encoder extends GBEncoder {
    /** @inheritDoc */
    public constructor() {
        super(false);
    }
}

/**
 * Encoder for gbk encoding.
 */
export class GBKEncoder extends GBEncoder {
    /** @inheritDoc */
    public constructor() {
        super(true);
    }
}
