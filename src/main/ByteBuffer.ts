/*
 * Copyright (C) 2021 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

/** Special value returned when end of the buffer has been hit. */
export const END_OF_BUFFER = -1;

/**
 * A byte buffer which allows bytes to be read and restored.
 */
export class ByteBuffer {
    /** The input bytes. */
    private readonly bytes: readonly number[] | Uint8Array;

    /** Current position in the input bytes. */
    private position = 0;

    /** Bytes which have been written back to the buffer. */
    private readonly restoredBytes: number[] = [];

    /**
     * Creates a new byte buffer backed by the given byte array.
     *
     * @param bytes - Array of initial bytes in the buffer.
     */
    public constructor(bytes: number[] | Uint8Array) {
        this.bytes = bytes;
    }

    /**
     * Checks if end of buffer has been hit.
     *
     * @returns True if end of buffer, false if not.
     */
    public isEndOfBuffer(): boolean {
        return this.position >= this.bytes.length && this.restoredBytes.length === 0;
    }

    /**
     * Reads the next byte from the buffer and returns it. END_OF_BUFFER is returned when there are no more bytes to
     * read.
     *
     * @returns The read byte or END_OF_BUFFER when no more bytes to read.
     */
    public read(): number {
        return this.restoredBytes.pop() ?? this.bytes[this.position++] ?? END_OF_BUFFER;
    }

    /**
     * Restores the specified bytes so they are returned by the next reads in the given order.
     *
     * @param bytes - The bytes to restore.
     */
    public write(...bytes: number[]): void {
        for (let index = bytes.length - 1; index >= 0; --index) {
            this.restoredBytes.push(bytes[index]);
        }
    }
}
