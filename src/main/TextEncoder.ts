/*
 * Copyright (C) 2021 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { ByteBuffer } from "./ByteBuffer.ts";
import { FINISHED } from "./constants.ts";
import type { Encoder } from "./Encoder.ts";
import { type Encoding, getEncoding } from "./Encoding.ts";

/**
 * Converts string to code points.
 *
 * @param string - Input string of UTF-16 code units.
 * @returns Code points.
 */
function stringToCodePoints(string: string): number[] {
    const n = string.length;
    let i = 0;
    const codePoints = [];
    while (i < n) {
        const c = string.charCodeAt(i);
        if (c < 0xD800 || c > 0xDFFF) {
            codePoints.push(c);
        } else if (c >= 0xDC00 && c <= 0xDFFF) {
            codePoints.push(0xFFFD);
        } else {
            if (i === n - 1) {
                codePoints.push(0xFFFD);
            } else {
                const d = string.charCodeAt(i + 1);
                if (d >= 0xDC00 && d <= 0xDFFF) {
                    const a = c & 0x3FF;
                    const b = d & 0x3FF;
                    codePoints.push(0x10000 + (a << 10) + b);
                    i++;
                } else {
                    codePoints.push(0xFFFD);
                }
            }
        }
        i++;
    }
    return codePoints;
}

/**
 * Adds encoded bytes to the given output array.
 *
 * @param output - Output array to add the encoded bytes to.
 * @param result - Encoded byte or bytes to add.
 */
function appendEncodedBytes(output: number[], result: number | number[]): void {
    if (Array.isArray(result)) {
        output.push(...result);
    } else {
        output.push(result);
    }
}

/**
 * Encodes a single code point with the given encoder.
 *
 * @param encoder   - Encoder to use.
 * @param codePoint - Code point to encode.
 * @returns Encoded bytes, including any required state prefix.
 */
function encodeCodePoint(encoder: Encoder, codePoint: number): number[] {
    const input = new ByteBuffer([ codePoint ]);
    const output: number[] = [];
    while (!input.isEndOfBuffer()) {
        const result = encoder.encode(input);
        appendEncodedBytes(output, result);
    }
    return output;
}

/**
 * The TextEncoder represents an encoder for a specific text encoding, such as UTF-8, ISO-8859-2, KOI8-R, GBK, etc.
 * An encoder takes a string and emits an array of encoded bytes.
 */
export class TextEncoder implements globalThis.TextEncoder {
    private readonly enc: Encoding;

    /**
     * Creates a new encoder for the given encoding.
     *
     * @param label - The encoding label. Defaults to UTF-8
     */
    public constructor(label = "utf-8") {
        this.enc = getEncoding(label);
    }

    /** @returns The name of the encoding. */
    public get encoding(): string {
        return this.enc.getName();
    }

    /**
     * Encodes the given string and returns the encoded bytes.
     *
     * @param input - The string to encode.
     * @returns The encoded bytes.
     */
    public encode(input = ""): Uint8Array<ArrayBuffer> {
        const encoder = this.enc.createEncoder();

        // Encode the input string
        const inputStream = new ByteBuffer(stringToCodePoints(input));
        const output: number[] = [];
        let result: number | number[] | null;
        while (true) {
            result = encoder.encode(inputStream);
            if (result === FINISHED) {
                break;
            }
            appendEncodedBytes(output, result);
        }

        // Create and return byte array with encoded string
        return new Uint8Array(output);
    }

    /** @inheritdoc */
    public encodeInto(source: string, destination: Uint8Array): TextEncoderEncodeIntoResult {
        const encoder = this.enc.createEncoder();
        let read = 0;
        let written = 0;
        let trailingBytes = encoder.getTrailingBytes();

        // Keep each accepted source prefix independently decodable, including final bytes for stateful encodings.
        for (const codePoint of stringToCodePoints(source)) {
            if (written === destination.byteLength) {
                break;
            }
            const bytes = encodeCodePoint(encoder, codePoint);
            const candidateTrailingBytes = encoder.getTrailingBytes();
            if (written + bytes.length + candidateTrailingBytes.length > destination.byteLength) {
                break;
            }
            destination.set(bytes, written);
            written += bytes.length;
            read += codePoint > 0xFFFF ? 2 : 1;
            trailingBytes = candidateTrailingBytes;
        }

        destination.set(trailingBytes, written);
        written += trailingBytes.length;

        return { read, written };
    }
}

/**
 * Creates and returns a new text encoder for the given encoding. When encoding is utf-8 then the built-in
 * text encoder (which only supports utf-8) is returned. Otherwise our own implementation is returned for this
 * specific encoding.
 *
 * @param label - The encoding label. Defaults to "utf-8".
 * @returns The created text encoder.
 */
export function createTextEncoder(label = "utf-8"): globalThis.TextEncoder | TextEncoder {
    return typeof globalThis.TextEncoder === "function" && getEncoding(label).getName() === "utf-8"
        ? new globalThis.TextEncoder()
        : new TextEncoder(label);
}
