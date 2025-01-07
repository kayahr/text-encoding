/*
 * Copyright (C) 2021 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import iso885913 from "../../../data/iso-8859-13.cp.js";
import { SingleByteDecoder } from "../decoders/SingleByteDecoder.js";
import { SingleByteEncoder } from "../encoders/SingleByteEncoder.js";
import { registerEncoding } from "../Encoding.js";

registerEncoding(
    "iso-8859-13",
    [
        "iso-8859-13",
        "iso8859-13",
        "iso885913"
    ],
    SingleByteDecoder.forCodePoints(iso885913),
    SingleByteEncoder.forCodePoints(iso885913)
);
