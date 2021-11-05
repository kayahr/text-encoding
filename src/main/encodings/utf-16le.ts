/*
 * Copyright (C) 2021 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { UTF16LEDecoder } from "../decoders/UTF16Decoder";
import { UTF16LEEncoder } from "../encoders/UTF16Encoder";
import { registerEncoding } from "../Encoding";

registerEncoding(
    "utf-16le",
    [
        "utf-16",
        "utf-16le"
    ],
    UTF16LEDecoder,
    UTF16LEEncoder
);
