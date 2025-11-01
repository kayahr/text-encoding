/*
 * Copyright (C) 2021 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import xMacCyrillic from "../../../data/x-mac-cyrillic.cp.json" with { type: "json" };
import { SingleByteDecoder } from "../decoders/SingleByteDecoder.ts";
import { SingleByteEncoder } from "../encoders/SingleByteEncoder.ts";
import { registerEncoding } from "../Encoding.ts";

registerEncoding(
    "x-mac-cyrillic",
    [
        "x-mac-cyrillic",
        "x-mac-ukrainian"
    ],
    SingleByteDecoder.forCodePoints(xMacCyrillic),
    SingleByteEncoder.forCodePoints(xMacCyrillic)
);
