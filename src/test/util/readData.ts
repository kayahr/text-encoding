/*
 * Copyright (C) 2021 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { readFile } from "node:fs/promises";

/**
 * Reads binary data from the given file.
 *
 * @param fileName - Name of the file to read. Relative to src/test/data directory.
 * @returns The read file.
 */
export async function readData(fileName: string): Promise<Uint8Array> {
    return new Uint8Array((await readFile(`src/test/data/${fileName}`)).buffer);
}
