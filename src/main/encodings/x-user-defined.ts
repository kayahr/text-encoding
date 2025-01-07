/*
 * Copyright (C) 2021 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { XUserDefinedDecoder } from "../decoders/XUserDefinedDecoder.js";
import { XUserDefinedEncoder } from "../encoders/XUserDefinedEncoder.js";
import { registerEncoding } from "../Encoding.js";

registerEncoding(
    "x-user-defined",
    [
        "x-user-defined"
    ],
    XUserDefinedDecoder,
    XUserDefinedEncoder
);
