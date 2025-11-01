/*
 * Copyright (C) 2021 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { AbstractEncoder } from "../AbstractEncoder.ts";
import { type ByteBuffer, END_OF_BUFFER } from "../ByteBuffer.ts";
import { FINISHED } from "../constants.ts";
import type { EncoderConstructor } from "../Encoder.ts";
import { indexOf, isASCII } from "../util.ts";

/**
 * Encoder for single byte encodings.
 */
export class SingleByteEncoder extends AbstractEncoder {
    private readonly index: Array<number | null>;

    /**
     * Constructs new encoder for the given code points.
     *
     * @param codePoints - The code points of the encoding.
     */
    private constructor(index: Array<number | null>) {
        super();
        this.index = index;
    }

    /**
     * Creates and returns a single byte encoder class for the given code points.
     *
     * @param codePoints - The code points of the encoding to encode.
     * @returns The created single byte encoder class.
     */
    public static forCodePoints(codePoints: Array<number | null>): EncoderConstructor {
        return class extends SingleByteEncoder {
            public constructor() {
                super(codePoints);
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
        const index = indexOf(this.index, codePoint);
        if (index == null) {
            return this.fail(codePoint);
        }
        return index + 0x80;
    }
}
