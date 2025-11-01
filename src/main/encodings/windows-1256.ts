/*
 * Copyright (C) 2021 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import windows1256 from "../../../data/windows-1256.cp.js";
import { SingleByteDecoder } from "../decoders/SingleByteDecoder.ts";
import { SingleByteEncoder } from "../encoders/SingleByteEncoder.ts";
import { registerEncoding } from "../Encoding.ts";

registerEncoding(
    "windows-1256",
    [
        "cp1256",
        "windows-1256",
        "x-cp1256"
    ],
    SingleByteDecoder.forCodePoints(windows1256),
    SingleByteEncoder.forCodePoints(windows1256)
);
