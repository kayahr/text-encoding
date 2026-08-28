/*
 * Copyright (C) 2021 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import iso88598 from "../../../data/iso-8859-8.cp.js";
import { SingleByteDecoder } from "../decoders/SingleByteDecoder.ts";
import { SingleByteEncoder } from "../encoders/SingleByteEncoder.ts";
import { registerEncoding } from "../Encoding.ts";

registerEncoding(
    "iso-8859-8-i",
    [
        "csiso88598i",
        "iso-8859-8-i",
        "logical"
    ],
    SingleByteDecoder.forCodePoints(iso88598),
    SingleByteEncoder.forCodePoints(iso88598)
);
