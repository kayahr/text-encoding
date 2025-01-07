/*
 * Copyright (C) 2021 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import iso88592 from "../../../data/iso-8859-2.cp.js";
import { SingleByteDecoder } from "../decoders/SingleByteDecoder.js";
import { SingleByteEncoder } from "../encoders/SingleByteEncoder.js";
import { registerEncoding } from "../Encoding.js";

registerEncoding(
    "iso-8859-2",
    [
        "csisolatin2",
        "iso-8859-2",
        "iso-ir-101",
        "iso8859-2",
        "iso88592",
        "iso_8859-2",
        "iso_8859-2:1987",
        "l2",
        "latin2"
    ],
    SingleByteDecoder.forCodePoints(iso88592),
    SingleByteEncoder.forCodePoints(iso88592)
);
