/*
 * Copyright (C) 2021 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { EUCJPDecoder } from "../decoders/EUCJPDecoder.ts";
import { EUCJPEncoder } from "../encoders/EUCJPEncoder.ts";
import { registerEncoding } from "../Encoding.ts";

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
