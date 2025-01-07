/*
 * Copyright (C) 2021 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import xMacCyrillic from "../../../data/x-mac-cyrillic.cp.json" with { type: "json" };
import { SingleByteDecoder } from "../decoders/SingleByteDecoder.js";
import { SingleByteEncoder } from "../encoders/SingleByteEncoder.js";
import { registerEncoding } from "../Encoding.js";

registerEncoding(
    "x-mac-cyrillic",
    [
        "x-mac-cyrillic",
        "x-mac-ukrainian"
    ],
    SingleByteDecoder.forCodePoints(xMacCyrillic),
    SingleByteEncoder.forCodePoints(xMacCyrillic)
);
