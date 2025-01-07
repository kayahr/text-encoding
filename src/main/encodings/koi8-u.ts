/*
 * Copyright (C) 2021 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import koi8u from "../../../data/koi8-u.cp.js";
import { SingleByteDecoder } from "../decoders/SingleByteDecoder.js";
import { SingleByteEncoder } from "../encoders/SingleByteEncoder.js";
import { registerEncoding } from "../Encoding.js";

registerEncoding(
    "koi8-u",
    [
        "koi8-ru",
        "koi8-u"
    ],
    SingleByteDecoder.forCodePoints(koi8u),
    SingleByteEncoder.forCodePoints(koi8u)
);
