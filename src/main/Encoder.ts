/*
 * Copyright (C) 2021 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { ByteBuffer } from "./ByteBuffer.js";

/** Encoder constructor type. */
export type EncoderConstructor = new () => Encoder;

/**
 * Interface for encoders.
 */
export interface Encoder {
    /**
     * Encodes the next code point(s) in the given buffer and returns the encoded bytes.
     *
     * @param buffer - The buffer containing the code points to encode.
     * @return The encoded byte(s) to emit, or {@link ./constants/FINISHED} when encoding is finished.
     */
    encode(buffer: ByteBuffer): number | number[];
}
