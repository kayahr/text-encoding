/*
 * Copyright (C) 2021 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import * as fs from "fs";
import * as path from "path";
import { promisify } from "util";

const readFile = promisify(fs.readFile);

/**
 * Reads binary data from the given file.
 *
 * @param fileName - Name of the file to read. Relative to src/test/data directory.
 * @return The read file.
 */
export async function readData(fileName: string): Promise<Uint8Array> {
    return new Uint8Array(await readFile(path.join(__dirname, "..", "..", "..", "src", "test", "data", fileName)));
}
