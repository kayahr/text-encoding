/*
 * Copyright (C) 2021 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { ByteBuffer } from "./ByteBuffer.js";
import { FINISHED } from "./constants.js";
import { Encoder } from "./Encoder.js";
import { Encoding, getEncoding } from "./Encoding.js";

/**
 * Converts string to code points.
 *
 * @param string - Input string of UTF-16 code units.
 * @return Code points.
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
        } else if (c >= 0xD800 && c <= 0xDBFF) {
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
 * The TextEncoder represents an encoder for a specific text encoding, such as UTF-8, ISO-8859-2, KOI8-R, GBK, etc.
 * An encoder takes a string and emits an array of encoded bytes.
 */
export class TextEncoder implements globalThis.TextEncoder {
    private readonly enc: Encoding;
    private encoder: Encoder | null = null;

    /**
     * Creates a new encoder for the given encoding.
     *
     * @param label - The encoding label. Defaults to UTF-8
     */
    public constructor(label = "utf-8") {
        this.enc = getEncoding(label);
    }

    /** @return The name of the encoding. */
    public get encoding(): string {
        return this.enc.getName();
    }

    /**
     * Encodes the given string and returns the encoded bytes.
     *
     * @param input - The string to encode.
     * @return The encoded bytes.
     */
    public encode(input = ""): Uint8Array<ArrayBuffer> {
        // Initialize encoder if not already done
        this.encoder ??= this.enc.createEncoder();

        // Encode the input string
        const inputStream = new ByteBuffer(stringToCodePoints(input));
        const output = [];
        let result: number | number[] | null;
        while (true) {
            result = this.encoder.encode(inputStream);
            if (result === FINISHED) {
                break;
            }
            if (Array.isArray(result)) {
                output.push(...result);
            }  else {
                output.push(result);
            }
        }

        // Create and return byte array with encoded string
        return new Uint8Array(output);
    }

    /** @inheritDoc */
    public encodeInto(source: string, destination: Uint8Array): TextEncoderEncodeIntoResult {
        // Initialize encoder if not already done
        this.encoder ??= this.enc.createEncoder();

        // Encode the input string
        const inputStream = new ByteBuffer(stringToCodePoints(source));
        let result: number | number[] | null;
        let read = 0;
        let written = 0;
        while (written < destination.byteLength) {
            result = this.encoder.encode(inputStream);
            if (result === FINISHED) {
                break;
            }
            if (Array.isArray(result)) {
                if (result.length + written > destination.byteLength) {
                    break;
                }
                destination.set(result, written);
                written += result.length;
            } else {
                destination[written++] = result;
            }
            read++;
        }

        // Report back number of code points read and bytes written
        return { read, written };
    }
}

/**
 * Creates and returns a new text encoder for the given encoding. When encoding is utf-8 then the built-in
 * text encoder (which only supports utf-8) is returned. Otherwise our own implementation is returned for this
 * specific encoding.
 *
 * @param label - The encoding label. Defaults to "utf-8".
 * @return The created text encoder.
 */
export function createTextEncoder(label: string = "utf-8"): globalThis.TextEncoder | TextEncoder {
    if (label === "utf-8" && typeof globalThis.TextEncoder === "function") {
        return new globalThis.TextEncoder();
    } else {
        return new TextEncoder(label);
    }
}
