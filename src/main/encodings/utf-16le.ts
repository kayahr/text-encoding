/*
 * Copyright (C) 2021 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { UTF16LEDecoder } from "../decoders/UTF16Decoder.ts";
import { UTF16LEEncoder } from "../encoders/UTF16Encoder.ts";
import { registerEncoding } from "../Encoding.ts";

registerEncoding(
    "utf-16le",
    [
        "csunicode",
        "iso-10646-ucs-2",
        "ucs-2",
        "unicode",
        "unicodefeff",
        "utf-16",
        "utf-16le"
    ],
    UTF16LEDecoder,
    UTF16LEEncoder
);
