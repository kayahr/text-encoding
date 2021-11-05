/*
 * Copyright (C) 2021 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import * as windows_1255 from "../../../data/windows-1255.cp.json";
import { SingleByteDecoder } from "../decoders/SingleByteDecoder";
import { SingleByteEncoder } from "../encoders/SingleByteEncoder";
import { registerEncoding } from "../Encoding";

registerEncoding(
    "windows-1255",
    [
        "cp1255",
        "windows-1255",
        "x-cp1255"
    ],
    SingleByteDecoder.forCodePoints(windows_1255),
    SingleByteEncoder.forCodePoints(windows_1255)
);
