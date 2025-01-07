/*
 * Copyright (C) 2021 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import iso885914 from "../../../data/iso-8859-14.cp.js";
import { SingleByteDecoder } from "../decoders/SingleByteDecoder.js";
import { SingleByteEncoder } from "../encoders/SingleByteEncoder.js";
import { registerEncoding } from "../Encoding.js";

registerEncoding(
    "iso-8859-14",
    [
        "iso-8859-14",
        "iso8859-14",
        "iso885914"
    ],
    SingleByteDecoder.forCodePoints(iso885914),
    SingleByteEncoder.forCodePoints(iso885914)
);
