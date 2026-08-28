/*
 * Copyright (C) 2021 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { ByteBuffer } from "./ByteBuffer.ts";
import { DEFAULT_ENCODING, FINISHED } from "./constants.ts";
import type { Decoder } from "./Decoder.ts";
import { type Encoding, getEncoding } from "./Encoding.ts";

const OUTPUT_CHUNK_SIZE = 4096;

interface BufferedOutput {
    readonly chunks: string[];
    readonly codePoints: number[];
}

/**
 * Converts one or more code points to a string.
 *
 * @param codePoints - Code point or code points to convert.
 * @returns The created string.
 */
function codePointsToString(codePoints: number | number[]): string {
    return typeof codePoints === "number" ? String.fromCodePoint(codePoints) : String.fromCodePoint(...codePoints);
}

/**
 * Flushes buffered code points to the given output chunks.
 *
 * @param output     - Output chunks to append the created string to.
 * @param codePoints - Code points to flush.
 */
function flushCodePoints(output: string[], codePoints: number[]): void {
    output.push(String.fromCodePoint(...codePoints));
    codePoints.length = 0;
}

/**
 * Buffers a decoded code point, flushing a full chunk to the output.
 *
 * @param output     - Output chunks to append full chunks to.
 * @param codePoints - Code point buffer.
 * @param codePoint  - Decoded code point to buffer.
 */
function appendCodePoint(output: string[], codePoints: number[], codePoint: number): void {
    codePoints.push(codePoint);
    if (codePoints.length === OUTPUT_CHUNK_SIZE) {
        flushCodePoints(output, codePoints);
    }
}

/**
 * Buffers one or more decoded code points, flushing full chunks to the output.
 *
 * @param output     - Output chunks to append full chunks to.
 * @param codePoints - Code point buffer.
 * @param result     - Decoded code point or code points to buffer.
 */
function appendCodePoints(output: string[], codePoints: number[], result: number | number[]): void {
    if (typeof result === "number") {
        appendCodePoint(output, codePoints, result);
    } else {
        for (const codePoint of result) {
            appendCodePoint(output, codePoints, codePoint);
        }
    }
}

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
    private readonly bomEncoding: boolean;
    private seenBOM = false;
    private decoder: Decoder | null = null;

    /**
     * Creates text decoder for the given encoding.
     *
     * @param label - The label of the encoding. Defaults to 'utf-8'
     */
    public constructor(label = DEFAULT_ENCODING, { fatal = false, ignoreBOM = false }: TextDecoderOptions = {}) {
        this.enc = getEncoding(label);
        const name = this.enc.getName();
        this.bomEncoding = name === "utf-8" || name === "utf-16le" || name === "utf-16be";
        this.fatal = fatal;
        this.ignoreBOM = ignoreBOM;
    }

    /** @returns The name of the encoding. */
    public get encoding(): string {
        return this.enc.getName();
    }

    /**
     * Decoded the given input into string and returns it.
     *
     * @param input   - The input to decode.
     * @param options - The decoding options.
     * @returns The decoded string.
     */
    public decode(input?: BufferSource | ArrayBufferLike | ArrayBufferView, { stream = false }: TextDecodeOptions = {}): string {
        let bytes: Uint8Array;
        if (input instanceof Uint8Array) {
            bytes = input;
        } else if (input instanceof ArrayBuffer
                || (typeof SharedArrayBuffer === "function" && input instanceof SharedArrayBuffer)) {
            bytes = new Uint8Array(input);
        } else if (ArrayBuffer.isView(input)) {
            bytes = new Uint8Array(input.buffer, input.byteOffset, input.byteLength);
        } else {
            bytes = new Uint8Array(0);
        }

        // An empty streaming input cannot produce output. A final empty input must still flush a pending decoder state.
        if (bytes.byteLength === 0 && (stream || this.decoder == null)) {
            return "";
        }

        // Initialize decoder if not already done
        if (this.decoder == null) {
            this.decoder = this.enc.createDecoder(this.fatal);
            this.seenBOM = false;
        }

        try {
            // Decode the input bytes
            const inputStream = new ByteBuffer(bytes);
            const bufferedOutput: BufferedOutput | null = bytes.byteLength >= OUTPUT_CHUNK_SIZE
                ? { chunks: [], codePoints: [] }
                : null;
            let decoded = "";
            let result: number | number[] | null;
            while (!inputStream.isEndOfBuffer()) {
                result = this.decoder.decode(inputStream);
                if (result != null) {
                    if (bufferedOutput == null) {
                        decoded += codePointsToString(result);
                    } else {
                        appendCodePoints(bufferedOutput.chunks, bufferedOutput.codePoints, result);
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
                        if (bufferedOutput == null) {
                            decoded += codePointsToString(result);
                        } else {
                            appendCodePoints(bufferedOutput.chunks, bufferedOutput.codePoints, result);
                        }
                    }
                } while (!inputStream.isEndOfBuffer());
            }
            if (bufferedOutput != null) {
                if (bufferedOutput.codePoints.length > 0) {
                    flushCodePoints(bufferedOutput.chunks, bufferedOutput.codePoints);
                }
                decoded = bufferedOutput.chunks.join("");
            }

            // Remove BOM header from output if ignoreBOM flag is not set
            if (this.bomEncoding && !this.ignoreBOM && !this.seenBOM) {
                if (decoded.length > 0) {
                    this.seenBOM = true;
                    if (decoded[0] === "\uFEFF") {
                        decoded = decoded.substring(1);
                    }
                }
            }

            return decoded;
        } finally {
            if (!stream) {
                this.decoder = null;
            }
        }
    }
}
