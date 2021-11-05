/*
 * Copyright (C) 2021 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import * as iso_8859_14 from "../../../data/iso-8859-14.cp.json";
import { SingleByteDecoder } from "../decoders/SingleByteDecoder";
import { SingleByteEncoder } from "../encoders/SingleByteEncoder";
import { registerEncoding } from "../Encoding";

registerEncoding(
    "iso-8859-14",
    [
        "iso-8859-14",
        "iso8859-14",
        "iso885914"
    ],
    SingleByteDecoder.forCodePoints(iso_8859_14),
    SingleByteEncoder.forCodePoints(iso_8859_14)
);
