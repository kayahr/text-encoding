/*
 * Copyright (C) 2021 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import * as iso_8859_15 from "../../../data/iso-8859-15.cp.json";
import { SingleByteDecoder } from "../decoders/SingleByteDecoder";
import { SingleByteEncoder } from "../encoders/SingleByteEncoder";
import { registerEncoding } from "../Encoding";

registerEncoding(
    "iso-8859-15",
    [
        "csisolatin9",
        "iso-8859-15",
        "iso8859-15",
        "iso885915",
        "iso_8859-15",
        "l9"
    ],
    SingleByteDecoder.forCodePoints(iso_8859_15),
    SingleByteEncoder.forCodePoints(iso_8859_15)
);
