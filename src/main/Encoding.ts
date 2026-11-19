/*
 * Copyright (C) 2021 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import type { Decoder, DecoderConstructor } from "./Decoder.ts";
import type { Encoder, EncoderConstructor } from "./Encoder.ts";

/** Map with registered encodings. Map key is any lower-cased encoding label. */
const encodings = new Map<string, Encoding>();

/**
 * Normalizes an encoding label according to the WHATWG Encoding Standard.
 *
 * Removes leading and trailing ASCII whitespace: TAB (U+0009), LF (U+000A), FF (U+000C), CR (U+000D) and SPACE (U+0020).
 * Converts only ASCII uppercase letters A-Z to lowercase. Other whitespace and Unicode letters remain unchanged, so invalid labels such as
 * a label surrounded by non-breaking spaces (U+00A0) or containing the Kelvin sign (U+212A) are not accepted through normalization.
 *
 * @param label - The encoding label to normalize.
 * @returns The label with surrounding ASCII whitespace removed and ASCII uppercase letters converted to lowercase.
 * @see https://encoding.spec.whatwg.org/#concept-encoding-get
 */
function normalizeEncodingLabel(label: string): string {
    return label.replace(/^[\t\n\f\r ]+|[\t\n\f\r ]+$/g, "").replace(/[A-Z]/g, character => character.toLowerCase());
}

/**
 * Registers an encoding.
 *
 * @param name    - The encoding name.
 * @param labels  - The list of encoding labels.
 * @param decoder - The constructor of the decoder which can decode this encoding.
 * @param encoder - The constructor of the encoder which can encode this encoding.
 * @returns The created and registered encoding.
 */
export function registerEncoding(name: string, labels: readonly string[], decoder: DecoderConstructor,
        encoder: EncoderConstructor): Encoding {
    const encoding = new Encoding(name, decoder, encoder);
    for (const label of labels) {
        encodings.set(label, encoding);
    }
    return encoding;
}

/**
 * Returns the encoding for the specified label.
 *
 * @param label - The label of the encoding to look for.
 * @returns The found encoding.
 * @throws RangeError - When encoding was not found.
 */
export function getEncoding(label: string): Encoding {
    const encoding = encodings.get(normalizeEncodingLabel(label));
    if (encoding == null) {
        throw new RangeError(`Encoding not supported: ${label}`);
    }
    return encoding;
}

/**
 * Encoding.
 */
export class Encoding {
    /** The encoding name. */
    private readonly name: string;

    /** The constructor of the decoder which can decode this encoding. */
    private readonly decoder: DecoderConstructor;

    /** The constructor of the encoder which can encode this encoding. */
    private readonly encoder: EncoderConstructor;

    /**
     * Creates a new encoding.
     *
     * @param name - The encoding name.
     * @param decoder - The constructor of the decoder which can decode this encoding.
     * @param encoder - The constructor of the encoder which can encode this encoding.
     */
    public constructor(name: string, decoder: DecoderConstructor, encoder: EncoderConstructor) {
        this.name = name;
        this.decoder = decoder;
        this.encoder = encoder;
    }

    /**
     * Returns the encoding name.
     *
     * @returns The encoding name.
     */
    public getName(): string {
        return this.name;
    }

    /**
     * Creates a new decoder for this encoding.
     *
     * @param fatal - True to throw exception on decoding errors, false to use replacement characters instead for
     *                characters which can't be decoded.
     * @returns The created decoder.
     */
    public createDecoder(fatal?: boolean): Decoder {
        return new this.decoder(fatal);
    }

    /**
     * Creates a new encoder for this encoding.
     *
     * @returns The created encoder.
     */
    public createEncoder(): Encoder {
        return new this.encoder();
    }
}
