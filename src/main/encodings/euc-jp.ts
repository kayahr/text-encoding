/*
 * Copyright (C) 2021 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { EUCJPDecoder } from "../decoders/EUCJPDecoder.js";
import { EUCJPEncoder } from "../encoders/EUCJPEncoder.js";
import { registerEncoding } from "../Encoding.js";

registerEncoding(
    "euc-jp",
    [
        "cseucpkdfmtjapanese",
        "euc-jp",
        "x-euc-jp"
    ],
    EUCJPDecoder,
    EUCJPEncoder
);
