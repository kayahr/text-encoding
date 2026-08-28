/*
 * Copyright (C) 2021 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import type { ByteBuffer } from "./ByteBuffer.ts";
import type { Encoder } from "./Encoder.ts";

export const NO_TRAILING_BYTES: readonly number[] = [];

/**
 * Base class for encoders.
 */
export abstract class AbstractEncoder implements Encoder {
    /** @inheritdoc */
    public getTrailingBytes(): readonly number[] {
        return NO_TRAILING_BYTES;
    }

    /** @inheritdoc */
    public abstract encode(buffer: ByteBuffer): number | number[];

    /**
     * Fails the encoding by throwing an exception
     *
     * @param codePoint - The code point which could not be encoded.
     */
    protected fail(codePoint: number): never {
        throw new TypeError(`The code point ${codePoint} could not be encoded`);
    }
}
