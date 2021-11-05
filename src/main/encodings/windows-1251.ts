/*
 * Copyright (C) 2021 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import * as windows_1251 from "../../../data/windows-1251.cp.json";
import { SingleByteDecoder } from "../decoders/SingleByteDecoder";
import { SingleByteEncoder } from "../encoders/SingleByteEncoder";
import { registerEncoding } from "../Encoding";

registerEncoding(
    "windows-1251",
    [
        "cp1251",
        "windows-1251",
        "x-cp1251"
    ],
    SingleByteDecoder.forCodePoints(windows_1251),
    SingleByteEncoder.forCodePoints(windows_1251)
);
