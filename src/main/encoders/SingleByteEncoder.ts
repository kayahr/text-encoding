/*
 * Copyright (C) 2021 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { AbstractEncoder } from "../AbstractEncoder.ts";
import { type ByteBuffer, END_OF_BUFFER } from "../ByteBuffer.ts";
import { FINISHED } from "../constants.ts";
import type { EncoderConstructor } from "../Encoder.ts";
import { isASCII } from "../util.ts";

type IndexLookup = (codePoint: number) => number | null;

/**
 * Encoder for single byte encodings.
 */
export class SingleByteEncoder extends AbstractEncoder {
    private readonly getIndex: IndexLookup;

    /**
     * Constructs new encoder for the given code points.
     *
     * @param getIndex - Function returning the encoding pointer for a code point.
     */
    private constructor(getIndex: IndexLookup) {
        super();
        this.getIndex = getIndex;
    }

    /**
     * Creates and returns a single byte encoder class for the given code points.
     *
     * @param codePoints - The code points of the encoding to encode.
     * @returns The created single byte encoder class.
     */
    public static forCodePoints(codePoints: Array<number | null>): EncoderConstructor {
        let index: Map<number, number> | null = null;
        const getIndex = (codePoint: number): number | null => {
            if (index == null) {
                index = new Map<number, number>();
                for (let pointer = 0; pointer < codePoints.length; ++pointer) {
                    const indexedCodePoint = codePoints[pointer];
                    if (indexedCodePoint != null && indexedCodePoint !== 0 && !index.has(indexedCodePoint)) {
                        index.set(indexedCodePoint, pointer);
                    }
                }
            }
            return index.get(codePoint) ?? null;
        };
        return class extends SingleByteEncoder {
            public constructor() {
                super(getIndex);
            }
        };
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
        const index = this.getIndex(codePoint);
        if (index == null) {
            return this.fail(codePoint);
        }
        return index + 0x80;
    }
}
