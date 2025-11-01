/*
 * Copyright (C) 2021 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import { ShiftJISDecoder } from "../decoders/ShiftJISDecoder.ts";
import { ShiftJISEncoder } from "../encoders/ShiftJISEncoder.ts";
import { registerEncoding } from "../Encoding.ts";

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
