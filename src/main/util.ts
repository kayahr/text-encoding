/*
 * Copyright (C) 2021 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

/**
 * Checks if given value is an ASCII character. An ASCII character is a numeric value in the range
 * 0x00 to 0x7F, inclusive.
 *
 * @param value - The value to test.
 * @returns True if value is an ASCII character, false if not.
 */
export function isASCII(value: number): boolean {
    return value >= 0x00 && value <= 0x7F;
}

/**
 * Converts a UTF16 code unit to bytes.
 *
 * @param codeUnit  - The code unit to convert
 * @param bigEndian - True if big endian, false if little endian.
 * @returns The converted bytes.
 */
export function convertCodeUnitToBytes(codeUnit: number, bigEndian: boolean): [ number, number ] {
    const byte1 = codeUnit >> 8;
    const byte2 = codeUnit & 0x00FF;
    return bigEndian ? [ byte1, byte2 ] : [ byte2, byte1 ];
}

/**
 * Checks if given value is within the given range.
 *
 * @param value - The value to test.
 * @param min   - The minimum value in the range, inclusive.
 * @param max   - The maximum value in the range, inclusive.
 * @returns True if value >= min and value <= max.
 */
export function inRange(value: number, min: number, max: number): boolean {
    return value >= min && value <= max;
}
