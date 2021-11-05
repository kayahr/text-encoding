/*
 * Copyright (C) 2021 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import * as x_mac_cyrillic from "../../../data/x-mac-cyrillic.cp.json";
import { SingleByteDecoder } from "../decoders/SingleByteDecoder";
import { SingleByteEncoder } from "../encoders/SingleByteEncoder";
import { registerEncoding } from "../Encoding";

registerEncoding(
    "x-mac-cyrillic",
    [
        "x-mac-cyrillic",
        "x-mac-ukrainian"
    ],
    SingleByteDecoder.forCodePoints(x_mac_cyrillic),
    SingleByteEncoder.forCodePoints(x_mac_cyrillic)
);
