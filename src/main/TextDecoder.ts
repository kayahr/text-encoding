/*
 * Copyright (C) 2021 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { ByteBuffer } from "./ByteBuffer.js";
import { DEFAULT_ENCODING, FINISHED } from "./constants.js";
import { Decoder } from "./Decoder.js";
import { Encoding, getEncoding } from "./Encoding.js";

/**
 * The TextDecoder represents a decoder for a specific text encoding, such as UTF-8, ISO-8859-2, KOI8-R, GBK, etc.
 * A decoder takes a stream of bytes as input and emits a stream of code points.
 */
export class TextDecoder implements globalThis.TextDecoder {
    /** True if byte order marker is ignored. */
    public readonly ignoreBOM: boolean;

    /** True if error mode is fatal. */
    public readonly fatal: boolean;

    private readonly enc: Encoding;
    private seenBOM = false;
    private decoder: Decoder | null = null;

    /**
     * Creates text decoder for the given encoding.
     *
     * @param label - The label of the encoding. Defaults to 'utf-8'
     */
    public constructor(label = DEFAULT_ENCODING, { fatal = false, ignoreBOM = false }: TextDecoderOptions = {}) {
        this.enc = getEncoding(label);
        this.fatal = fatal;
        this.ignoreBOM = ignoreBOM;
    }

    /** @return The name of the encoding. */
    public get encoding(): string {
        return this.enc.getName();
    }

    /**
     * Decoded the given input into string and returns it.
     *
     * @param input   - The input to decode.
     * @param options - The decoding options.
     * @return The decoded string.
     */
    public decode(input?: BufferSource | ArrayBufferLike | ArrayBufferView, { stream = false }: TextDecodeOptions = {}): string {
        let bytes;
        if (input instanceof ArrayBuffer) {
            bytes = new Uint8Array(input);
        } else if (ArrayBuffer.isView(input)) {
            bytes = new Uint8Array(input.buffer, input.byteOffset, input.byteLength);
        } else {
            bytes = new Uint8Array(0);
        }

        // Initialize decoder if not already done
        if (this.decoder == null) {
            this.decoder = this.enc.createDecoder(this.fatal);
            this.seenBOM = false;
        }

        // Decode the input bytes
        const inputStream = new ByteBuffer(bytes);
        let output = "";
        let result: number | number[] | null;
        while (!inputStream.isEndOfBuffer()) {
            result = this.decoder.decode(inputStream);
            if (result === FINISHED) {
                break;
            }
            if (result != null) {
                if (typeof result === "number") {
                    output += String.fromCodePoint(result);
                } else {
                    output += String.fromCodePoint(...result);
                }
            }
        }
        if (!stream) {
            do {
                result = this.decoder.decode(inputStream);
                if (result === FINISHED) {
                    break;
                }
                if (result != null) {
                    if (typeof result === "number") {
                        output += String.fromCodePoint(result);
                    } else {
                        output += String.fromCodePoint(...result);
                    }
                }
            } while (!inputStream.isEndOfBuffer());
            this.decoder = null;
        }

        // Remove BOM header from output if ignoreBOM flag is not set
        if ([ "utf-8", "utf-16le", "utf-16be" ].includes(this.encoding) && !this.ignoreBOM && !this.seenBOM) {
            if (output.length > 0) {
                this.seenBOM = true;
                if (output[0] === "\uFEFF") {
                    return output.substring(1);
                }
            }
        }

        return output;
    }
}
