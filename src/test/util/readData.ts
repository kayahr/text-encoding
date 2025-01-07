/*
 * Copyright (C) 2021 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { readFile } from "@kayahr/vitest-matchers";
import { toByteArray } from "base64-js";

/**
 * Reads binary data from the given file.
 *
 * @param fileName - Name of the file to read. Relative to src/test/data directory.
 * @return The read file.
 */
export async function readData(fileName: string): Promise<Uint8Array> {
    return toByteArray(await readFile(`src/test/data/${fileName}`, "base64"));
}
