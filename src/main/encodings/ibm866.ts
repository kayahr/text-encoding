/*
 * Copyright (C) 2021 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import ibm866 from "../../../data/ibm866.cp.js";
import { SingleByteDecoder } from "../decoders/SingleByteDecoder.js";
import { SingleByteEncoder } from "../encoders/SingleByteEncoder.js";
import { registerEncoding } from "../Encoding.js";

registerEncoding(
    "ibm866",
    [
        "866",
        "cp866",
        "csibm866",
        "ibm866"
    ],
    SingleByteDecoder.forCodePoints(ibm866),
    SingleByteEncoder.forCodePoints(ibm866)
);
