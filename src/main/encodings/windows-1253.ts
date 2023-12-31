/*
 * Copyright (C) 2021 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import * as windows1253 from "../../../data/windows-1253.cp.json";
import { SingleByteDecoder } from "../decoders/SingleByteDecoder";
import { SingleByteEncoder } from "../encoders/SingleByteEncoder";
import { registerEncoding } from "../Encoding";

registerEncoding(
    "windows-1253",
    [
        "cp1253",
        "windows-1253",
        "x-cp1253"
    ],
    SingleByteDecoder.forCodePoints(windows1253),
    SingleByteEncoder.forCodePoints(windows1253)
);
