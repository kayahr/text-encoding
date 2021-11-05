/*
 * Copyright (C) 2021 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { EUCJPDecoder } from "../decoders/EUCJPDecoder";
import { EUCJPEncoder } from "../encoders/EUCJPEncoder";
import { registerEncoding } from "../Encoding";

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
