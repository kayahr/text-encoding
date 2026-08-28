/*
 * Copyright (C) 2021 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import jis0208 from "../../../data/jis0208.cp.js";
import { CodePointIndex } from "./CodePointIndex.ts";

const SHIFT_JIS_EXCLUDED_POINTERS = [ 8272, 8835 ] as const;

let jis0208Index: CodePointIndex | null = null;
let shiftJISIndex: CodePointIndex | null = null;

/**
 * Returns the JIS0208 pointer for the given code point.
 *
 * @param codePoint - Code point to look up.
 * @returns The pointer or null if the code point is not indexed.
 */
export function getJIS0208Pointer(codePoint: number): number | null {
    jis0208Index ??= new CodePointIndex(jis0208);
    return jis0208Index.get(codePoint);
}

/**
 * Returns the Shift_JIS pointer for the given code point.
 *
 * @param codePoint - Code point to look up.
 * @returns The pointer or null if the code point is not indexed.
 */
export function getShiftJISPointer(codePoint: number): number | null {
    shiftJISIndex ??= new CodePointIndex(jis0208, 0, SHIFT_JIS_EXCLUDED_POINTERS);
    return shiftJISIndex.get(codePoint);
}
