/*
 * Copyright (C) 2021 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import * as ibm866 from "../../../data/ibm866.cp.json";
import { SingleByteDecoder } from "../decoders/SingleByteDecoder";
import { SingleByteEncoder } from "../encoders/SingleByteEncoder";
import { registerEncoding } from "../Encoding";

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
