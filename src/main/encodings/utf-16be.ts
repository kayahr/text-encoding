/*
 * Copyright (C) 2021 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { UTF16BEDecoder } from "../decoders/UTF16Decoder";
import { UTF16BEEncoder } from "../encoders/UTF16Encoder";
import { registerEncoding } from "../Encoding";

registerEncoding(
    "utf-16be",
    [
        "utf-16be"
    ],
    UTF16BEDecoder,
    UTF16BEEncoder
);
