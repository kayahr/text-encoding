/*
 * Copyright (C) 2026 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { assertSame } from "@kayahr/assert";
import { TextDecoder as LibraryTextDecoder } from "../../main/TextDecoder.ts";

const NativeTextDecoder = globalThis.TextDecoder;

const ALL_BYTES = range(0x00, 0xFF);
const GB_LEADS = range(0x81, 0xFE);
const GB_TRAILS = [ ...range(0x40, 0x7E), ...range(0x80, 0xFE) ];

function range(from: number, to: number): number[] {
    return Array.from({ length: to - from + 1 }, (_, index) => from + index);
}

function* sequences(...positions: ReadonlyArray<readonly number[]>): Generator<number[]> {
    const sequence = Array.from({ length: positions.length }, () => 0);
    function* generate(position: number): Generator<number[]> {
        if (position === positions.length) {
            yield sequence.slice();
            return;
        }
        for (const byte of positions[position]) {
            sequence[position] = byte;
            yield* generate(position + 1);
        }
    }
    yield* generate(0);
}

function* concatenate(...iterables: ReadonlyArray<Iterable<readonly number[]>>): Generator<readonly number[]> {
    for (const iterable of iterables) {
        yield* iterable;
    }
}

function formatCharacters(value: string): string {
    return Array.from(value, character => `U+${character.codePointAt(0)?.toString(16).toUpperCase().padStart(4, "0")}`).join(" ");
}

function assertCharactersLikeNode(libraryEncoding: string, candidates: Iterable<readonly number[]>, nativeEncoding = libraryEncoding): void {
    const nativeDecoder = new NativeTextDecoder(nativeEncoding, { fatal: true, ignoreBOM: true });
    const libraryDecoder = new LibraryTextDecoder(libraryEncoding, { ignoreBOM: true });
    const examples: string[] = [];
    let mismatches = 0;
    for (const candidate of candidates) {
        const input = Uint8Array.from(candidate);
        let expected: string;
        try {
            expected = nativeDecoder.decode(input);
        } catch {
            continue;
        }
        const actual = libraryDecoder.decode(input);
        if (actual !== expected) {
            ++mismatches;
            if (examples.length < 8) {
                const bytes = candidate.map(byte => byte.toString(16).toUpperCase().padStart(2, "0")).join(" ");
                examples.push(`${bytes}: ${formatCharacters(actual)} instead of ${formatCharacters(expected)}`);
            }
        }
    }
    assertSame(mismatches, 0,
        `${libraryEncoding} differs from Node.js ${nativeEncoding}; examples: ${examples.join(", ")}`);
}

function assertDecodesLikeNode(libraryEncoding: string, input: Uint8Array, nativeEncoding = libraryEncoding): void {
    const options = { ignoreBOM: true };
    const expected = new NativeTextDecoder(nativeEncoding, options).decode(input);
    const actual = new LibraryTextDecoder(libraryEncoding, options).decode(input);
    if (actual === expected) {
        return;
    }
    let offset = 0;
    while (offset < actual.length && offset < expected.length && actual[offset] === expected[offset]) {
        ++offset;
    }
    assertSame(actual.slice(offset, offset + 16), expected.slice(offset, offset + 16),
        `${libraryEncoding} differs from Node.js ${nativeEncoding} at UTF-16 offset ${offset}`);
}

function allUnicodeScalars(): string {
    const chunks: string[] = [];
    const codePoints: number[] = [];
    for (let codePoint = 0; codePoint <= 0x10FFFF; ++codePoint) {
        if (codePoint >= 0xD800 && codePoint <= 0xDFFF) {
            continue;
        }
        codePoints.push(codePoint);
        if (codePoints.length === 4096) {
            chunks.push(String.fromCodePoint(...codePoints));
            codePoints.length = 0;
        }
    }
    chunks.push(String.fromCodePoint(...codePoints));
    return chunks.join("");
}

function unicodeEncodingInput(encoding: string): Uint8Array {
    const scalars = allUnicodeScalars();
    if (encoding === "utf-8") {
        return new globalThis.TextEncoder().encode(scalars);
    }
    const utf16le = Uint8Array.from(Buffer.from(scalars, "utf16le"));
    if (encoding === "utf-16le") {
        return utf16le;
    }
    for (let index = 0; index < utf16le.length; index += 2) {
        [ utf16le[index], utf16le[index + 1] ] = [ utf16le[index + 1], utf16le[index] ];
    }
    return utf16le;
}

function gb18030FourByteCharacters(): Uint8Array {
    const pointers = 39_420 + (1_237_575 - 189_000 + 1);
    const bytes = new Uint8Array(pointers * 4);
    let offset = 0;
    const append = (pointer: number): void => {
        bytes[offset + 3] = pointer % 10 + 0x30;
        pointer = Math.floor(pointer / 10);
        bytes[offset + 2] = pointer % 126 + 0x81;
        pointer = Math.floor(pointer / 126);
        bytes[offset + 1] = pointer % 10 + 0x30;
        bytes[offset] = Math.floor(pointer / 10) + 0x81;
        offset += 4;
    };
    for (let pointer = 0; pointer <= 39_419; ++pointer) {
        append(pointer);
    }
    for (let pointer = 189_000; pointer <= 1_237_575; ++pointer) {
        append(pointer);
    }
    return bytes;
}

/**
 * Compares every character of an encoding with the native Node.js TextDecoder.
 *
 * @param libraryEncoding - Encoding used by the library decoder.
 * @param nativeEncoding - Encoding used by the native decoder.
 */
export function assertEncodingLikeNode(libraryEncoding: string, nativeEncoding = libraryEncoding): void {
    switch (libraryEncoding) {
        case "utf-8":
        case "utf-16le":
        case "utf-16be":
            assertDecodesLikeNode(libraryEncoding, unicodeEncodingInput(libraryEncoding), nativeEncoding);
            break;
        case "big5":
            assertCharactersLikeNode(libraryEncoding, concatenate(sequences(ALL_BYTES),
                sequences(range(0x81, 0xFE), [ ...range(0x40, 0x7E), ...range(0xA1, 0xFE) ])), nativeEncoding);
            break;
        case "euc-jp": {
            const bytes = range(0xA1, 0xFE);
            assertCharactersLikeNode(libraryEncoding, concatenate(sequences(ALL_BYTES), sequences([ 0x8E ], range(0xA1, 0xDF)),
                sequences(bytes, bytes), sequences([ 0x8F ], bytes, bytes)), nativeEncoding);
            break;
        }
        case "euc-kr":
            assertCharactersLikeNode(libraryEncoding,
                concatenate(sequences(ALL_BYTES), sequences(range(0xA1, 0xFE), range(0x41, 0xFE))), nativeEncoding);
            break;
        case "gbk":
            assertCharactersLikeNode(libraryEncoding,
                concatenate(sequences(ALL_BYTES), sequences(GB_LEADS, GB_TRAILS)), nativeEncoding);
            break;
        case "gb18030":
            assertCharactersLikeNode(libraryEncoding,
                concatenate(sequences(ALL_BYTES), sequences(GB_LEADS, GB_TRAILS)), nativeEncoding);
            assertDecodesLikeNode(libraryEncoding, gb18030FourByteCharacters(), nativeEncoding);
            break;
        case "iso-2022-jp": {
            const bytes = range(0x21, 0x7E);
            const ascii = sequences(ALL_BYTES);
            const roman = sequences([ 0x1B ], [ 0x28 ], [ 0x4A ], [ 0x5C, 0x7E ], [ 0x1B ], [ 0x28 ], [ 0x42 ]);
            const katakana = sequences([ 0x1B ], [ 0x28 ], [ 0x49 ], range(0x21, 0x5F), [ 0x1B ], [ 0x28 ], [ 0x42 ]);
            const jis0208 = sequences([ 0x1B ], [ 0x24 ], [ 0x42 ], bytes, bytes, [ 0x1B ], [ 0x28 ], [ 0x42 ]);
            assertCharactersLikeNode(libraryEncoding, concatenate(ascii, roman, katakana, jis0208), nativeEncoding);
            break;
        }
        case "shift_jis":
            assertCharactersLikeNode(libraryEncoding, concatenate(sequences(ALL_BYTES),
                sequences([ ...range(0x81, 0x9F), ...range(0xE0, 0xFC) ],
                    [ ...range(0x40, 0x7E), ...range(0x80, 0xFC) ])), nativeEncoding);
            break;
        default:
            assertCharactersLikeNode(libraryEncoding, sequences(ALL_BYTES), nativeEncoding);
    }
}
