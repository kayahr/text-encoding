/*
 * Copyright (C) 2021 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { GBDecoder } from "../decoders/GBDecoder.js";
import { GB18030Encoder } from "../encoders/GBEncoder.js";
import { registerEncoding } from "../Encoding.js";

registerEncoding(
    "gb18030",
    [
        "gb18030"
    ],
    GBDecoder,
    GB18030Encoder
);
