/*
 * Copyright (C) 2021 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import * as iso_8859_5 from "../../../data/iso-8859-5.cp.json";
import { SingleByteDecoder } from "../decoders/SingleByteDecoder";
import { SingleByteEncoder } from "../encoders/SingleByteEncoder";
import { registerEncoding } from "../Encoding";

registerEncoding(
    "iso-8859-5",
    [
        "csisolatincyrillic",
        "cyrillic",
        "iso-8859-5",
        "iso-ir-144",
        "iso8859-5",
        "iso88595",
        "iso_8859-5",
        "iso_8859-5:1988"
    ],
    SingleByteDecoder.forCodePoints(iso_8859_5),
    SingleByteEncoder.forCodePoints(iso_8859_5)
);
