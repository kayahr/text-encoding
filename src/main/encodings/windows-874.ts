/*
 * Copyright (C) 2021 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import * as windows_874 from "../../../data/windows-874.cp.json";
import { SingleByteDecoder } from "../decoders/SingleByteDecoder";
import { SingleByteEncoder } from "../encoders/SingleByteEncoder";
import { registerEncoding } from "../Encoding";

registerEncoding(
    "windows-874",
    [
        "dos-874",
        "iso-8859-11",
        "iso8859-11",
        "iso885911",
        "tis-620",
        "windows-874"
    ],
    SingleByteDecoder.forCodePoints(windows_874),
    SingleByteEncoder.forCodePoints(windows_874)
);
