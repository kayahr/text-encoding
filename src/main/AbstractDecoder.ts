/*
 * Copyright (C) 2021 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { ByteBuffer } from "./ByteBuffer.js";
import { Decoder } from "./Decoder.js";

/**
 * Base class for decoders.
 */
export abstract class AbstractDecoder implements Decoder {
    /**
     * @param fatal - True to throw an exception when a character can't be decoded. False to decode to a
     *                replacement character instead.
     */
    public constructor(protected readonly fatal = false) {}

    /**
     * Fails the decoding by throwing an exception (if fatal flag is true) or returning a replacement character.
     *
     * @return Replacement character to use for the character which could not be decoded.
     * @throws TypeError - When fatal flag is set to true.
     */
    protected fail(): number {
        if (this.fatal) {
            throw TypeError("Decoder error");
        }
        return 0xFFFD;
    }

    /** @inheritDoc */
    public abstract decode(buffer: ByteBuffer): number | number[] | null;
}
