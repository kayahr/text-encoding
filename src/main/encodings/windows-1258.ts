/*
 * Copyright (C) 2021 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import * as windows1258 from "../../../data/windows-1258.cp.json";
import { SingleByteDecoder } from "../decoders/SingleByteDecoder";
import { SingleByteEncoder } from "../encoders/SingleByteEncoder";
import { registerEncoding } from "../Encoding";

registerEncoding(
    "windows-1258",
    [
        "cp1258",
        "windows-1258",
        "x-cp1258"
    ],
    SingleByteDecoder.forCodePoints(windows1258),
    SingleByteEncoder.forCodePoints(windows1258)
);
