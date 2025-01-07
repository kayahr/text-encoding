/*
 * Copyright (C) 2021 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import jis0208 from "../../../data/jis0208.cp.js";
import { AbstractEncoder } from "../AbstractEncoder.js";
import { ByteBuffer, END_OF_BUFFER } from "../ByteBuffer.js";
import { FINISHED } from "../constants.js";
import { indexOf, isASCII } from "../util.js";

enum State {
    ASCII = 0,
    Roman = 1,
    jis0208 = 2
}

/**
 * Encoder for iso-2022-jp encoding.
 */
export class ISO2022JPEncoder extends AbstractEncoder {
    private state = State.ASCII;

    /** @inheritDoc */
    public encode(buffer: ByteBuffer): number | number[] {
        let codePoint = buffer.read();
        if (codePoint === END_OF_BUFFER && this.state !== State.ASCII) {
            buffer.write(codePoint);
            this.state = State.ASCII;
            return [ 0x1B, 0x28, 0x42 ];
        }
        if (codePoint === END_OF_BUFFER && this.state === State.ASCII) {
            return FINISHED;
        }
        if ((this.state === State.ASCII || this.state === State.Roman)
                && (codePoint === 0x000E || codePoint === 0x000F || codePoint === 0x001B)) {
            return this.fail(0xFFFD);
        }
        if (this.state === State.ASCII && isASCII(codePoint)) {
            return codePoint;
        }
        if (this.state === State.Roman && ((isASCII(codePoint) && codePoint !== 0x005C
                && codePoint !== 0x007E) || (codePoint === 0x00A5 || codePoint === 0x203E))) {
            if (isASCII(codePoint)) {
                return codePoint;
            }
            if (codePoint === 0x00A5) {
                return 0x5C;
            }
            if (codePoint === 0x203E) {
                return 0x7E;
            }
        }
        if (isASCII(codePoint) && this.state !== State.ASCII) {
            buffer.write(codePoint);
            this.state = State.ASCII;
            return [ 0x1B, 0x28, 0x42 ];
        }
        if ((codePoint === 0x00A5 || codePoint === 0x203E) && this.state !== State.Roman) {
            buffer.write(codePoint);
            this.state = State.Roman;
            return [ 0x1B, 0x28, 0x4A ];
        }
        if (codePoint === 0x2212) {
            codePoint = 0xFF0D;
        }
        const index = indexOf(jis0208, codePoint);
        if (index == null) {
            return this.fail(codePoint);
        }
        if (this.state !== State.jis0208) {
            buffer.write(codePoint);
            this.state = State.jis0208;
            return [ 0x1B, 0x24, 0x42 ];
        }
        const lead = Math.floor(index / 94) + 0x21;
        const trail = index % 94 + 0x21;
        return [ lead, trail ];
    }
}
