/*
 * Copyright (C) 2021 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import * as windows_1257 from "../../../data/windows-1257.cp.json";
import { SingleByteDecoder } from "../decoders/SingleByteDecoder";
import { SingleByteEncoder } from "../encoders/SingleByteEncoder";
import { registerEncoding } from "../Encoding";

registerEncoding(
    "windows-1257",
    [
        "cp1257",
        "windows-1257",
        "x-cp1257"
    ],
    SingleByteDecoder.forCodePoints(windows_1257),
    SingleByteEncoder.forCodePoints(windows_1257)
);
