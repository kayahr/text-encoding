/*
 * Copyright (C) 2021 Klaus Reimer <k@ailis.de>
 * See LICENSE.md for licensing information.
 */

/** Special value returned when end of the buffer has been hit. */
export const END_OF_BUFFER = -1;

/**
 * A buffer backed by by a dynamic byte array. Bytes can be read to or written from the buffer.
 */
export class ByteBuffer {
    /** The bytes in the buffer. */
    private readonly bytes: number[];

    /**
     * Creates a new byte buffer backed by the given byte array.
     *
     * @param bytes - Array of initial bytes in the buffer.
     */
    public constructor(bytes: number[] | Uint8Array) {
        // Reversed as push/pop is more efficient than shift/unshift
        this.bytes = Array.from(bytes).reverse();
    }

    /**
     * Checks if end of buffer has been hit.
     *
     * @return True if end of buffer, false if not.
     */
    public isEndOfBuffer(): boolean {
        return this.bytes.length === 0;
    }

    /**
     * Reads the next byte from the buffer and returns it. END_OF_BUFFER is returned when there are no more bytes to
     * read.
     *
     * @return The read byte or END_OF_BUFFER when no more bytes to read.
     */
    public read(): number {
        return this.bytes.pop() ?? END_OF_BUFFER;
    }

    /**
     * Writes the specified bytes to the buffer.
     *
     * @param bytes - The bytes to write.
     */
    public write(...bytes: number[]): void {
        this.bytes.push(...bytes);
    }
}
