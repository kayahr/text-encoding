/*
 * Copyright (C) 2021 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import * as iso885913 from "../../../data/iso-8859-13.cp.json";
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
    SingleByteDecoder.forCodePoints(iso885913),
    SingleByteEncoder.forCodePoints(iso885913)
);
