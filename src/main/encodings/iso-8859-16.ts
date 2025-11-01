/*
 * Copyright (C) 2021 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import iso885916 from "../../../data/iso-8859-16.cp.js";
import { SingleByteDecoder } from "../decoders/SingleByteDecoder.ts";
import { SingleByteEncoder } from "../encoders/SingleByteEncoder.ts";
import { registerEncoding } from "../Encoding.ts";

registerEncoding(
    "iso-8859-16",
    [
        "iso-8859-16"
    ],
    SingleByteDecoder.forCodePoints(iso885916),
    SingleByteEncoder.forCodePoints(iso885916)
);
