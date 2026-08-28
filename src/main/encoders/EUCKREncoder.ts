/*
 * Copyright (C) 2021 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import euckr from "../../../data/euc-kr.cp.js";
import { AbstractEncoder } from "../AbstractEncoder.ts";
import { type ByteBuffer, END_OF_BUFFER } from "../ByteBuffer.ts";
import { FINISHED } from "../constants.ts";
import { isASCII } from "../util.ts";
import { CodePointIndex } from "./CodePointIndex.ts";

let euckrIndex: CodePointIndex | null = null;

/**
 * Returns the EUC-KR pointer for the given code point.
 *
 * @param codePoint - Code point to look up.
 * @returns The pointer or null if the code point is not indexed.
 */
function getIndex(codePoint: number): number | null {
    euckrIndex ??= new CodePointIndex(euckr);
    return euckrIndex.get(codePoint);
}

/**
 * Encoder for euc-kr encoding.
 */
export class EUCKREncoder extends AbstractEncoder {
    /** @inheritdoc */
    public encode(buffer: ByteBuffer): number | number[] {
        const codePoint = buffer.read();
        if (codePoint === END_OF_BUFFER) {
            return FINISHED;
        }
        if (isASCII(codePoint)) {
            return codePoint;
        }
        const index = getIndex(codePoint);
        if (index == null) {
            return this.fail(codePoint);
        }
        const lead = Math.floor(index / 190) + 0x81;
        const trail = (index % 190) + 0x41;
        return [ lead, trail ];
    }
}
