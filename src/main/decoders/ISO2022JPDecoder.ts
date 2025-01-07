/*
 * Copyright (C) 2021 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

import jis0208 from "../../../data/jis0208.cp.js";
import { AbstractDecoder } from "../AbstractDecoder.js";
import { ByteBuffer, END_OF_BUFFER } from "../ByteBuffer.js";
import { FINISHED } from "../constants.js";
import { inRange } from "../util.js";

enum State {
    ASCII = 0,
    Roman = 1,
    Katakana = 2,
    LeadByte = 3,
    TrailByte = 4,
    EscapeStart = 5,
    Escape = 6
}

/**
 * Decoder for iso-2022-jp encoding.
 */
export class ISO2022JPDecoder extends AbstractDecoder {
    private state = State.ASCII;
    private lead = 0x00;
    private outputFlag = false;

    /** @inheritDoc */
    public decode(buffer: ByteBuffer): null | number | number[] {
        const byte = buffer.read();
        switch (this.state) {
            default:
            case State.ASCII:
                if (byte === 0x1B) {
                    this.state = State.EscapeStart;
                    return null;
                }
                if (inRange(byte, 0x00, 0x7F) && byte !== 0x0E
                    && byte !== 0x0F && byte !== 0x1B) {
                    this.outputFlag = false;
                    return byte;
                }
                if (byte === END_OF_BUFFER) {
                    return FINISHED;
                }
                this.outputFlag = false;
                return this.fail();

            case State.Roman:
                if (byte === 0x1B) {
                    this.state = State.EscapeStart;
                    return null;
                }
                if (byte === 0x5C) {
                    this.outputFlag = false;
                    return 0x00A5;
                }
                if (byte === 0x7E) {
                    this.outputFlag = false;
                    return 0x203E;
                }
                if (inRange(byte, 0x00, 0x7F) && byte !== 0x0E && byte !== 0x0F
                    && byte !== 0x1B && byte !== 0x5C && byte !== 0x7E) {
                    this.outputFlag = false;
                    return byte;
                }
                if (byte === END_OF_BUFFER) {
                    return FINISHED;
                }
                this.outputFlag = false;
                return this.fail();

            case State.Katakana:
                if (byte === 0x1B) {
                    this.state = State.EscapeStart;
                    return null;
                }
                if (inRange(byte, 0x21, 0x5F)) {
                    this.outputFlag = false;
                    return 0xFF61 - 0x21 + byte;
                }
                if (byte === END_OF_BUFFER) {
                    return FINISHED;
                }
                this.outputFlag = false;
                return this.fail();

            case State.LeadByte:
                if (byte === 0x1B) {
                    this.state = State.EscapeStart;
                    return null;
                }
                if (inRange(byte, 0x21, 0x7E)) {
                    this.outputFlag = false;
                    this.lead = byte;
                    this.state = State.TrailByte;
                    return null;
                }
                if (byte === END_OF_BUFFER) {
                    return FINISHED;
                }
                this.outputFlag = false;
                return this.fail();

            case State.TrailByte:
                if (byte === 0x1B) {
                    this.state = State.EscapeStart;
                    return this.fail();
                }
                if (inRange(byte, 0x21, 0x7E)) {
                    this.state = State.LeadByte;
                    const index = (this.lead - 0x21) * 94 + byte - 0x21;
                    const codePoint = jis0208[index] ?? null;
                    if (codePoint == null) {
                        return this.fail();
                    }
                    return codePoint;
                }
                if (byte === END_OF_BUFFER) {
                    this.state = State.LeadByte;
                    buffer.write(byte);
                    return this.fail();
                }
                this.state = State.LeadByte;
                return this.fail();

            case State.EscapeStart:
                if (byte === 0x24 || byte === 0x28) {
                    this.lead = byte;
                    this.state = State.Escape;
                    return null;
                }
                buffer.write(byte);
                this.outputFlag = false;
                this.state = State.ASCII;
                return this.fail();

            case State.Escape: {
                const lead = this.lead;
                this.lead = 0x00;
                let state: State | null = null;
                if (lead === 0x28 && byte === 0x42) {
                    state = State.ASCII;
                }
                if (lead === 0x28 && byte === 0x4A) {
                    state = State.Roman;
                }
                if (lead === 0x28 && byte === 0x49) {
                    state = State.Katakana;
                }
                if (lead === 0x24 && (byte === 0x40 || byte === 0x42)) {
                    state = State.LeadByte;
                }
                if (state !== null) {
                    this.state = this.state = state;
                    const outputFlag = this.outputFlag;
                    this.outputFlag = true;
                    return !outputFlag ? null : this.fail();
                }
                buffer.write(lead, byte);
                this.outputFlag = false;
                this.state = State.ASCII;
                return this.fail();
            }
        }
    }
}
