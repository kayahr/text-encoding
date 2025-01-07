/*
 * Copyright (C) 2021 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { AbstractEncoder } from "../AbstractEncoder.js";
import { ByteBuffer, END_OF_BUFFER } from "../ByteBuffer.js";
import { FINISHED } from "../constants.js";
import { EncoderConstructor } from "../Encoder.js";
import { indexOf, isASCII } from "../util.js";

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
     * @return The created single byte encoder class.
     */
    public static forCodePoints(codePoints: Array<number | null>): EncoderConstructor {
        return class extends SingleByteEncoder {
            public constructor() {
                super(codePoints);
            }
        };
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
        const index = indexOf(this.index, codePoint);
        if (index == null) {
            return this.fail(codePoint);
        }
        return index + 0x80;
    }
}
