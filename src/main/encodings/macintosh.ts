/*
 * Copyright (C) 2021 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import * as macintosh from "../../../data/macintosh.cp.json";
import { SingleByteDecoder } from "../decoders/SingleByteDecoder";
import { SingleByteEncoder } from "../encoders/SingleByteEncoder";
import { registerEncoding } from "../Encoding";

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
