/*
 * Copyright (C) 2021 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import * as windows_1250 from "../../../data/windows-1250.cp.json";
import { SingleByteDecoder } from "../decoders/SingleByteDecoder";
import { SingleByteEncoder } from "../encoders/SingleByteEncoder";
import { registerEncoding } from "../Encoding";

registerEncoding(
    "windows-1250",
    [
        "cp1250",
        "windows-1250",
        "x-cp1250"
    ],
    SingleByteDecoder.forCodePoints(windows_1250),
    SingleByteEncoder.forCodePoints(windows_1250)
);
