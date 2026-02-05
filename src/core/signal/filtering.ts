/**
 * 2nd Order Butterworth Bandpass Filter
 */
export class BandpassFilter {
    // private x: number[] = [0, 0, 0]; // Removed unused
    private y: number[] = [0, 0, 0];
    private buffer: number[] = [];
    private readonly MA_WINDOW = 30; // 1 sec at 30fps

    process(value: number): number {
        this.buffer.push(value);
        if (this.buffer.length > this.MA_WINDOW) {
            this.buffer.shift();
        }

        // DC approximate
        const dc = this.buffer.reduce((a, b) => a + b, 0) / this.buffer.length;

        // AC signal
        const ac = value - dc;

        // Simple smoothing (Lowpass approximation)
        this.y[0] = 0.5 * ac + 0.5 * this.y[1];
        this.y[1] = this.y[0];

        return this.y[0];
    }

    reset() {
        this.buffer = [];
        this.y = [0, 0];
    }
}
