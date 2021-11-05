/*
 * Copyright (C) 2021 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { GBDecoder } from "../decoders/GBDecoder";
import { GBKEncoder } from "../encoders/GBEncoder";
import { registerEncoding } from "../Encoding";

registerEncoding(
    "gbk",
    [
        "chinese",
        "csgb2312",
        "csiso58gb231280",
        "gb2312",
        "gb_2312",
        "gb_2312-80",
        "gbk",
        "iso-ir-58",
        "x-gbk"
    ],
    GBDecoder,
    GBKEncoder
);
