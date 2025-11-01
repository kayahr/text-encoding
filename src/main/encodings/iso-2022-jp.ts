/*
 * Copyright (C) 2021 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { ISO2022JPDecoder } from "../decoders/ISO2022JPDecoder.ts";
import { ISO2022JPEncoder } from "../encoders/ISO2022JPEncoder.ts";
import { registerEncoding } from "../Encoding.ts";

registerEncoding(
    "iso-2022-jp",
    [
        "csiso2022jp",
        "iso-2022-jp"
    ],
    ISO2022JPDecoder,
    ISO2022JPEncoder
);
