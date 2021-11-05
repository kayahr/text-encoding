/*
 * Copyright (C) 2021 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import * as iso_8859_6 from "../../../data/iso-8859-6.cp.json";
import { SingleByteDecoder } from "../decoders/SingleByteDecoder";
import { SingleByteEncoder } from "../encoders/SingleByteEncoder";
import { registerEncoding } from "../Encoding";

registerEncoding(
    "iso-8859-6",
    [
        "arabic",
        "asmo-708",
        "csiso88596e",
        "csiso88596i",
        "csisolatinarabic",
        "ecma-114",
        "iso-8859-6",
        "iso-8859-6-e",
        "iso-8859-6-i",
        "iso-ir-127",
        "iso8859-6",
        "iso88596",
        "iso_8859-6",
        "iso_8859-6:1987"
    ],
    SingleByteDecoder.forCodePoints(iso_8859_6),
    SingleByteEncoder.forCodePoints(iso_8859_6)
);
