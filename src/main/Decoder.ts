/*
 * Copyright (C) 2021 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { ByteBuffer } from "./ByteBuffer.js";

/** Decoder constructor type. */
export type DecoderConstructor = new (fatal?: boolean) => Decoder;

/**
 * Interface for decoders.
 */
export interface Decoder {
    /**
     * Decodes the next code point(s) from the given buffer and returns it.
     *
     * @param buffer - The buffer containing the data to decode.
     * @return The next decoded code point(s), null if not enough data exists in the buffer to decode a complete
     *         code point, or FINISHED (-1) when decoding has been finished.
     */
    decode(buffer: ByteBuffer): number | number[] | null;
}
