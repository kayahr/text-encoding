/*
 * Copyright (C) 2021 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import windows1258 from "../../../data/windows-1258.cp.js";
import { SingleByteDecoder } from "../decoders/SingleByteDecoder.ts";
import { SingleByteEncoder } from "../encoders/SingleByteEncoder.ts";
import { registerEncoding } from "../Encoding.ts";

registerEncoding(
    "windows-1258",
    [
        "cp1258",
        "windows-1258",
        "x-cp1258"
    ],
    SingleByteDecoder.forCodePoints(windows1258),
    SingleByteEncoder.forCodePoints(windows1258)
);
