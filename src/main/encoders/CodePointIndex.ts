/*
 * Copyright (C) 2021 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

/** Reverse index from Unicode code points to encoding pointers. */
export class CodePointIndex {
    private readonly bmp = new Uint16Array(0x10000);
    private readonly supplementary: Map<number, number> | null = null;

    /**
     * Creates a reverse index for the given code point table.
     *
     * @param codePoints - Code point table to index.
     * @param start - First table pointer to include.
     * @param excludedRange - Optional inclusive table pointer range to exclude.
     */
    public constructor(codePoints: readonly number[], start = 0, excludedRange?: readonly [ number, number ]) {
        for (let pointer = start; pointer < codePoints.length; ++pointer) {
            const codePoint = codePoints[pointer];
            if (codePoint === 0 || (excludedRange != null && pointer >= excludedRange[0] && pointer <= excludedRange[1])) {
                continue;
            }
            if (codePoint <= 0xFFFF) {
                if (this.bmp[codePoint] === 0) {
                    this.bmp[codePoint] = pointer + 1;
                }
            } else {
                this.supplementary ??= new Map<number, number>();
                if (!this.supplementary.has(codePoint)) {
                    this.supplementary.set(codePoint, pointer);
                }
            }
        }
    }

    /**
     * Overrides the pointer for the given BMP code point.
     *
     * @param codePoint - BMP code point to override.
     * @param pointer - Table pointer to store.
     */
    public setBMP(codePoint: number, pointer: number): void {
        this.bmp[codePoint] = pointer + 1;
    }

    /**
     * Returns the pointer for the given code point.
     *
     * @param codePoint - Code point to look up.
     * @returns The pointer or null if the code point is not indexed.
     */
    public get(codePoint: number): number | null {
        if (codePoint <= 0xFFFF) {
            const pointer = this.bmp[codePoint];
            return pointer === 0 ? null : pointer - 1;
        }
        return this.supplementary?.get(codePoint) ?? null;
    }
}
