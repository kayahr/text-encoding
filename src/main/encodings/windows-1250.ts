/*
 * Copyright (C) 2021 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import windows1250 from "../../../data/windows-1250.cp.js";
import { SingleByteDecoder } from "../decoders/SingleByteDecoder.js";
import { SingleByteEncoder } from "../encoders/SingleByteEncoder.js";
import { registerEncoding } from "../Encoding.js";

registerEncoding(
    "windows-1250",
    [
        "cp1250",
        "windows-1250",
        "x-cp1250"
    ],
    SingleByteDecoder.forCodePoints(windows1250),
    SingleByteEncoder.forCodePoints(windows1250)
);
