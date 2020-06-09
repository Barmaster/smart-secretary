import { Input, Component } from '@angular/core';

// Time in miliseconds.
const UPDATE_RATE = 25;

@Component({
    selector: 'audio-visualizer',
    templateUrl: './audio-visualizer.html',
    styleUrls: ['./audio-visualizer.scss']
})
export class AudioVisualizerComponent {

    public frequencies: Uint8Array;
    private updateTimer: any;

    @Input()
    public analyserNode: AnalyserNode;

    public start(): void {
        this.updateTimer = setInterval(() => {
            if (this.analyserNode) {
                // See Fast Fourier Transform algorithm.
                const arrayLength = this.analyserNode.fftSize / 2;
                this.frequencies = new Uint8Array(arrayLength);
                this.analyserNode.getByteFrequencyData(this.frequencies);
            }
        }, UPDATE_RATE);
    }

    public stop(): void {
        this.frequencies = null;
        clearInterval(this.updateTimer);
    }
}
