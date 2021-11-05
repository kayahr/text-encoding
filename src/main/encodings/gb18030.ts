/*
 * Copyright (C) 2021 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { GBDecoder } from "../decoders/GBDecoder";
import { GB18030Encoder } from "../encoders/GBEncoder";
import { registerEncoding } from "../Encoding";

registerEncoding(
    "gb18030",
    [
        "gb18030"
    ],
    GBDecoder,
    GB18030Encoder
);
