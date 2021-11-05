/*
 * Copyright (C) 2021 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import * as iso_8859_3 from "../../../data/iso-8859-3.cp.json";
import { SingleByteDecoder } from "../decoders/SingleByteDecoder";
import { SingleByteEncoder } from "../encoders/SingleByteEncoder";
import { registerEncoding } from "../Encoding";

registerEncoding(
    "iso-8859-3",
    [
        "csisolatin3",
        "iso-8859-3",
        "iso-ir-109",
        "iso8859-3",
        "iso88593",
        "iso_8859-3",
        "iso_8859-3:1988",
        "l3",
        "latin3"
    ],
    SingleByteDecoder.forCodePoints(iso_8859_3),
    SingleByteEncoder.forCodePoints(iso_8859_3)
);
