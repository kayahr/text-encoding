/*
 * Copyright (C) 2021 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import * as iso_8859_8 from "../../../data/iso-8859-8.cp.json";
import { SingleByteDecoder } from "../decoders/SingleByteDecoder";
import { SingleByteEncoder } from "../encoders/SingleByteEncoder";
import { registerEncoding } from "../Encoding";

registerEncoding(
    "iso-8859-8",
    [
        "csiso88598e",
        "csisolatinhebrew",
        "hebrew",
        "iso-8859-8",
        "iso-8859-8-e",
        "iso-ir-138",
        "iso8859-8",
        "iso88598",
        "iso_8859-8",
        "iso_8859-8:1988",
        "visual"
    ],
    SingleByteDecoder.forCodePoints(iso_8859_8),
    SingleByteEncoder.forCodePoints(iso_8859_8)
);
