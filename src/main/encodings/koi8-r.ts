/*
 * Copyright (C) 2021 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import koi8r from "../../../data/koi8-r.cp.js";
import { SingleByteDecoder } from "../decoders/SingleByteDecoder.js";
import { SingleByteEncoder } from "../encoders/SingleByteEncoder.js";
import { registerEncoding } from "../Encoding.js";

registerEncoding(
    "koi8-r",
    [
        "cskoi8r",
        "koi",
        "koi8",
        "koi8-r",
        "koi8_r"
    ],
    SingleByteDecoder.forCodePoints(koi8r),
    SingleByteEncoder.forCodePoints(koi8r)
);
