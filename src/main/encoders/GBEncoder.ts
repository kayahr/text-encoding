/*
 * Copyright (C) 2021 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import gb18030 from "../../../data/gb18030.cp.js";
import gb18030ranges from "../../../data/gb18030.ranges.js";
import { AbstractEncoder } from "../AbstractEncoder.ts";
import { type ByteBuffer, END_OF_BUFFER } from "../ByteBuffer.ts";
import { FINISHED } from "../constants.ts";
import { isASCII } from "../util.ts";
import { CodePointIndex } from "./CodePointIndex.ts";

const GB18030_2005_PUA_POINTERS = [
    [ 0xE78D, 7182 ],
    [ 0xE78E, 7183 ],
    [ 0xE78F, 7184 ],
    [ 0xE790, 7185 ],
    [ 0xE791, 7186 ],
    [ 0xE792, 7187 ],
    [ 0xE793, 7188 ],
    [ 0xE794, 7201 ],
    [ 0xE795, 7202 ],
    [ 0xE796, 7208 ],
    [ 0xE81E, 23775 ],
    [ 0xE826, 23783 ],
    [ 0xE82B, 23788 ],
    [ 0xE82C, 23789 ],
    [ 0xE832, 23795 ],
    [ 0xE843, 23812 ],
    [ 0xE854, 23829 ],
    [ 0xE864, 23845 ]
] as const;

let gbIndex: CodePointIndex | null = null;

/**
 * Returns the GB18030 two-byte pointer for the given code point.
 *
 * @param codePoint - Code point to look up.
 * @returns The pointer or null if the code point is not indexed.
 */
function getGBPointer(codePoint: number): number | null {
    if (gbIndex == null) {
        gbIndex = new CodePointIndex(gb18030);
        for (const [ puaCodePoint, pointer ] of GB18030_2005_PUA_POINTERS) {
            gbIndex.setBMP(puaCodePoint, pointer);
        }
    }
    return gbIndex.get(codePoint);
}

/**
 * Returns the index for the given code point.
 *
 * @param codePoint - The code point to search for.
 * @returns The found index or null if not found.
 */
export function getIndex(codePoint: number): number {
    if (codePoint === 0xE7C7) {
        return 7457;
    }
    let start = 0;
    let end = gb18030ranges.length;
    while (start < end) {
        const middle = Math.floor((start + end) / 2);
        if (gb18030ranges[middle][1] <= codePoint) {
            start = middle + 1;
        } else {
            end = middle;
        }
    }
    const entry = gb18030ranges[start - 1];
    return entry[0] + codePoint - entry[1];
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

    /** @inheritdoc */
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
        const index = getGBPointer(codePoint);
        if (index !== null) {
            const lead = Math.floor(index / 190) + 0x81;
            const trail = index % 190;
            const offset = trail < 0x3F ? 0x40 : 0x41;
            return [ lead, trail + offset ];
        }
        if (this.gbkFlag) {
            return this.fail(codePoint);
        }
        const rangeIndex = getIndex(codePoint);
        const byte1 = Math.floor(rangeIndex / 12600);
        const byte2 = Math.floor(rangeIndex / 1260) % 10;
        const byte3 = Math.floor(rangeIndex / 10) % 126;
        const byte4 = rangeIndex % 10;
        return [ byte1 + 0x81, byte2 + 0x30, byte3 + 0x81, byte4 + 0x30 ];
    }
}

/**
 * Encoder for gb18030 encoding.
 */
export class GB18030Encoder extends GBEncoder {
    /** @inheritdoc */
    public constructor() {
        super(false);
    }
}

/**
 * Encoder for gbk encoding.
 */
export class GBKEncoder extends GBEncoder {
    /** @inheritdoc */
    public constructor() {
        super(true);
    }
}
