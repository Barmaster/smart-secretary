export class AudioRecorder {

    protected audioContext: AudioContext;

    protected mediaStream: MediaStream;

    private createAudioContext(): void {
        if (!!this.audioContext) {
            return;
        }
        this.audioContext = new AudioContext();
    }

    private createMediaStream(): Promise<any> {
        return navigator.mediaDevices.getUserMedia({ audio: true })
            .then(mediaStream => this.mediaStream = mediaStream);
    }
}
