/*
 * Copyright (C) 2021 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Decoder, DecoderConstructor } from "./Decoder.js";
import { Encoder, EncoderConstructor } from "./Encoder.js";

/** Map with registered encodings. Map key is any lower-cased encoding label. */
const encodings = new Map<string, Encoding>();

/**
 * Registers an encoding.
 *
 * @param name    - The encoding name.
 * @param labels  - The list of encoding labels.
 * @param decoder - The constructor of the decoder which can decode this encoding.
 * @param encoder - The constructor of the encoder which can encode this encoding.
 * @return The created and registered encoding.
 */
export function registerEncoding(name: string, labels: readonly string[], decoder: DecoderConstructor,
        encoder: EncoderConstructor): Encoding {
    const encoding = new Encoding(name, labels, decoder, encoder);
    for (const label of encoding.getLabels()) {
        encodings.set(label, encoding);
    }
    return encoding;
}

/**
 * Returns the encoding for the specified label.
 *
 * @param label - The label of the encoding to look for.
 * @return The found encoding.
 * @throws RangeError - When encoding was not found.
 */
export function getEncoding(label: string): Encoding {
    const encoding = encodings.get(label.trim().toLowerCase());
    if (encoding == null) {
        throw new RangeError("Encoding not supported: " + label);
    }
    return encoding;
}

/**
 * Encoding.
 */
export class Encoding {
    /**
     * Creates a new encoding.
     *
     * @param name - THe encoding name.
     * @param labels - The list of encoding labels.
     * @param decoder - The constructor of the decoder which can decode this encoding.
     * @param encoder - The constructor of the encoder which can encode this encoding.
     */
    public constructor(
        private readonly name: string,
        private readonly labels: readonly string[],
        private readonly decoder: DecoderConstructor,
        private readonly encoder: EncoderConstructor
    ) {}

    /**
     * Returns the encoding name.
     *
     * @return The encoding name.
     */
    public getName(): string {
        return this.name;
    }

    /**
     * Checks if encoding has the given label.
     *
     * @param label - The label to check.
     * @return True if encoding has the label, false if not.
     */
    public hasLabel(label: string): boolean {
        return this.labels.includes(label.trim().toLowerCase());
    }

    /**
     * Returns the labels of this encoding.
     *
     * @return The encoding labels.
     */
    public getLabels(): readonly string[] {
        return this.labels;
    }

    /**
     * Creates a new decoder for this encoding.
     *
     * @param fatal - True to throw exception on decoding errors, false to use replacement characters instead for
     *                characters which can't be decoded.
     * @return The created decoder.
     */
    public createDecoder(fatal?: boolean): Decoder {
        return new this.decoder(fatal);
    }

    /**
     * Creates a new encoder for this encoding.
     *
     * @return The created encoder.
     */
    public createEncoder(): Encoder {
        return new this.encoder();
    }
}
