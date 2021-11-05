/*
 * Copyright (C) 2021 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import * as windows_1254 from "../../../data/windows-1254.cp.json";
import { SingleByteDecoder } from "../decoders/SingleByteDecoder";
import { SingleByteEncoder } from "../encoders/SingleByteEncoder";
import { registerEncoding } from "../Encoding";

registerEncoding(
    "windows-1254",
    [
        "cp1254",
        "csisolatin5",
        "iso-8859-9",
        "iso-ir-148",
        "iso8859-9",
        "iso88599",
        "iso_8859-9",
        "iso_8859-9:1989",
        "l5",
        "latin5",
        "windows-1254",
        "x-cp1254"
    ],
    SingleByteDecoder.forCodePoints(windows_1254),
    SingleByteEncoder.forCodePoints(windows_1254)
);
