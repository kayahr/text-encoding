/*
 * Copyright (C) 2021 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { ISO2022JPDecoder } from "../decoders/ISO2022JPDecoder.js";
import { ISO2022JPEncoder } from "../encoders/ISO2022JPEncoder.js";
import { registerEncoding } from "../Encoding.js";

registerEncoding(
    "iso-2022-jp",
    [
        "csiso2022jp",
        "iso-2022-jp"
    ],
    ISO2022JPDecoder,
    ISO2022JPEncoder
);
