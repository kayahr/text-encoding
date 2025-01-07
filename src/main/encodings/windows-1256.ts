/*
 * Copyright (C) 2021 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import windows1256 from "../../../data/windows-1256.cp.js";
import { SingleByteDecoder } from "../decoders/SingleByteDecoder.js";
import { SingleByteEncoder } from "../encoders/SingleByteEncoder.js";
import { registerEncoding } from "../Encoding.js";

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
