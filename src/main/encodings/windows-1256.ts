/*
 * Copyright (C) 2021 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import * as windows_1256 from "../../../data/windows-1256.cp.json";
import { SingleByteDecoder } from "../decoders/SingleByteDecoder";
import { SingleByteEncoder } from "../encoders/SingleByteEncoder";
import { registerEncoding } from "../Encoding";

registerEncoding(
    "windows-1256",
    [
        "cp1256",
        "windows-1256",
        "x-cp1256"
    ],
    SingleByteDecoder.forCodePoints(windows_1256),
    SingleByteEncoder.forCodePoints(windows_1256)
);
