/*
 * Copyright (C) 2021 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { XUserDefinedDecoder } from "../decoders/XUserDefinedDecoder";
import { XUserDefinedEncoder } from "../encoders/XUserDefinedEncoder";
import { registerEncoding } from "../Encoding";

registerEncoding(
    "x-user-defined",
    [
        "x-user-defined"
    ],
    XUserDefinedDecoder,
    XUserDefinedEncoder
);
