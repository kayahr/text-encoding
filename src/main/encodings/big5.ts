/*
 * Copyright (C) 2021 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { Big5Decoder } from "../decoders/Big5Decoder";
import { Big5Encoder } from "../encoders/Big5Encoder";
import { registerEncoding } from "../Encoding";

registerEncoding(
    "big5",
    [
        "big5",
        "big5-hkscs",
        "cn-big5",
        "csbig5",
        "x-x-big5"
    ],
    Big5Decoder,
    Big5Encoder
);
