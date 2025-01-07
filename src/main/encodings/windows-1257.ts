/*
 * Copyright (C) 2021 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import windows1257 from "../../../data/windows-1257.cp.js";
import { SingleByteDecoder } from "../decoders/SingleByteDecoder.js";
import { SingleByteEncoder } from "../encoders/SingleByteEncoder.js";
import { registerEncoding } from "../Encoding.js";

registerEncoding(
    "windows-1257",
    [
        "cp1257",
        "windows-1257",
        "x-cp1257"
    ],
    SingleByteDecoder.forCodePoints(windows1257),
    SingleByteEncoder.forCodePoints(windows1257)
);
