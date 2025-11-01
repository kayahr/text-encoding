/*
 * Copyright (C) 2021 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { EUCKRDecoder } from "../decoders/EUCKRDecoder.ts";
import { EUCKREncoder } from "../encoders/EUCKREncoder.ts";
import { registerEncoding } from "../Encoding.ts";

registerEncoding(
    "euc-kr",
    [
        "cseuckr",
        "csksc56011987",
        "euc-kr",
        "iso-ir-149",
        "korean",
        "ks_c_5601-1987",
        "ks_c_5601-1989",
        "ksc5601",
        "ksc_5601",
        "windows-949"
    ],
    EUCKRDecoder,
    EUCKREncoder
);
