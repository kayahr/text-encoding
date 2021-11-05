/*
 * Copyright (C) 2021 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import * as iso_8859_16 from "../../../data/iso-8859-16.cp.json";
import { SingleByteDecoder } from "../decoders/SingleByteDecoder";
import { SingleByteEncoder } from "../encoders/SingleByteEncoder";
import { registerEncoding } from "../Encoding";

registerEncoding(
    "iso-8859-16",
    [
        "iso-8859-16"
    ],
    SingleByteDecoder.forCodePoints(iso_8859_16),
    SingleByteEncoder.forCodePoints(iso_8859_16)
);
