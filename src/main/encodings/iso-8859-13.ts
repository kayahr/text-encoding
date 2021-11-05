/*
 * Copyright (C) 2021 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import * as iso_8859_13 from "../../../data/iso-8859-13.cp.json";
import { SingleByteDecoder } from "../decoders/SingleByteDecoder";
import { SingleByteEncoder } from "../encoders/SingleByteEncoder";
import { registerEncoding } from "../Encoding";

registerEncoding(
    "iso-8859-13",
    [
        "iso-8859-13",
        "iso8859-13",
        "iso885913"
    ],
    SingleByteDecoder.forCodePoints(iso_8859_13),
    SingleByteEncoder.forCodePoints(iso_8859_13)
);
