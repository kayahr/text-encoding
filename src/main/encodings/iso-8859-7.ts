/*
 * Copyright (C) 2021 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import * as iso_8859_7 from "../../../data/iso-8859-7.cp.json";
import { SingleByteDecoder } from "../decoders/SingleByteDecoder";
import { SingleByteEncoder } from "../encoders/SingleByteEncoder";
import { registerEncoding } from "../Encoding";

registerEncoding(
    "iso-8859-7",
    [
        "csisolatingreek",
        "ecma-118",
        "elot_928",
        "greek",
        "greek8",
        "iso-8859-7",
        "iso-ir-126",
        "iso8859-7",
        "iso88597",
        "iso_8859-7",
        "iso_8859-7:1987",
        "sun_eu_greek"
    ],
    SingleByteDecoder.forCodePoints(iso_8859_7),
    SingleByteEncoder.forCodePoints(iso_8859_7)
);
