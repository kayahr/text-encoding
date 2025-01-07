/*
 * Copyright (C) 2021 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { UTF16LEDecoder } from "../decoders/UTF16Decoder.js";
import { UTF16LEEncoder } from "../encoders/UTF16Encoder.js";
import { registerEncoding } from "../Encoding.js";

registerEncoding(
    "utf-16le",
    [
        "utf-16",
        "utf-16le"
    ],
    UTF16LEDecoder,
    UTF16LEEncoder
);
