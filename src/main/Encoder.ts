/*
 * Copyright (C) 2021 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import type { ByteBuffer } from "./ByteBuffer.ts";

/** Encoder constructor type. */
export type EncoderConstructor = new () => Encoder;

/**
 * Interface for encoders.
 */
export interface Encoder {
    /**
     * Returns the bytes required to finish the encoded output in the current state without changing that state.
     *
     * @returns The bytes required to finish the encoded output.
     */
    getTrailingBytes(): readonly number[];

    /**
     * Encodes the next code point(s) in the given buffer and returns the encoded bytes.
     *
     * @param buffer - The buffer containing the code points to encode.
     * @returns The encoded byte(s) to emit, or {@link ./constants/FINISHED} when encoding is finished.
     */
    encode(buffer: ByteBuffer): number | number[];
}
