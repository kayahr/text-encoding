/*
 * Copyright (C) 2021 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import macintosh from "../../../data/macintosh.cp.js";
import { SingleByteDecoder } from "../decoders/SingleByteDecoder.js";
import { SingleByteEncoder } from "../encoders/SingleByteEncoder.js";
import { registerEncoding } from "../Encoding.js";

registerEncoding(
    "macintosh",
    [
        "csmacintosh",
        "mac",
        "macintosh",
        "x-mac-roman"
    ],
    SingleByteDecoder.forCodePoints(macintosh),
    SingleByteEncoder.forCodePoints(macintosh)
);
