/*
 * Copyright (C) 2021 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import * as koi8u from "../../../data/koi8-u.cp.json";
import { SingleByteDecoder } from "../decoders/SingleByteDecoder";
import { SingleByteEncoder } from "../encoders/SingleByteEncoder";
import { registerEncoding } from "../Encoding";

registerEncoding(
    "koi8-u",
    [
        "koi8-ru",
        "koi8-u"
    ],
    SingleByteDecoder.forCodePoints(koi8u),
    SingleByteEncoder.forCodePoints(koi8u)
);
