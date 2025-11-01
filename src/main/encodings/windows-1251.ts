/*
 * Copyright (C) 2021 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import windows1251 from "../../../data/windows-1251.cp.js";
import { SingleByteDecoder } from "../decoders/SingleByteDecoder.ts";
import { SingleByteEncoder } from "../encoders/SingleByteEncoder.ts";
import { registerEncoding } from "../Encoding.ts";

registerEncoding(
    "windows-1251",
    [
        "cp1251",
        "windows-1251",
        "x-cp1251"
    ],
    SingleByteDecoder.forCodePoints(windows1251),
    SingleByteEncoder.forCodePoints(windows1251)
);
