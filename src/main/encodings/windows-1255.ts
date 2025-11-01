/*
 * Copyright (C) 2021 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import windows1255 from "../../../data/windows-1255.cp.js";
import { SingleByteDecoder } from "../decoders/SingleByteDecoder.ts";
import { SingleByteEncoder } from "../encoders/SingleByteEncoder.ts";
import { registerEncoding } from "../Encoding.ts";

registerEncoding(
    "windows-1255",
    [
        "cp1255",
        "windows-1255",
        "x-cp1255"
    ],
    SingleByteDecoder.forCodePoints(windows1255),
    SingleByteEncoder.forCodePoints(windows1255)
);
