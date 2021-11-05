/*
 * Copyright (C) 2021 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import * as iso_8859_2 from "../../../data/iso-8859-2.cp.json";
import { SingleByteDecoder } from "../decoders/SingleByteDecoder";
import { SingleByteEncoder } from "../encoders/SingleByteEncoder";
import { registerEncoding } from "../Encoding";

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
    SingleByteDecoder.forCodePoints(iso_8859_2),
    SingleByteEncoder.forCodePoints(iso_8859_2)
);
