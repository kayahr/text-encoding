/*
 * Copyright (C) 2021 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import * as koi8_r from "../../../data/koi8-r.cp.json";
import { SingleByteDecoder } from "../decoders/SingleByteDecoder";
import { SingleByteEncoder } from "../encoders/SingleByteEncoder";
import { registerEncoding } from "../Encoding";

registerEncoding(
    "koi8-r",
    [
        "cskoi8r",
        "koi",
        "koi8",
        "koi8-r",
        "koi8_r"
    ],
    SingleByteDecoder.forCodePoints(koi8_r),
    SingleByteEncoder.forCodePoints(koi8_r)
);
