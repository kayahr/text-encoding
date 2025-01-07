/*
 * Copyright (C) 2021 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { ShiftJISDecoder } from "../decoders/ShiftJISDecoder.js";
import { ShiftJISEncoder } from "../encoders/ShiftJISEncoder.js";
import { registerEncoding } from "../Encoding.js";

registerEncoding(
    "shift_jis",
    [
        "csshiftjis",
        "ms932",
        "ms_kanji",
        "shift-jis",
        "shift_jis",
        "sjis",
        "windows-31j",
        "x-sjis"
    ],
    ShiftJISDecoder,
    ShiftJISEncoder
);
