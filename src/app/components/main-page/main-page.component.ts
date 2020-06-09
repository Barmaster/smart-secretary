import { Component, ViewChild } from '@angular/core';
import { SpeechConfig, SpeechRecognizer, AudioConfig } from 'microsoft-cognitiveservices-speech-sdk';
import { DomSanitizer } from '@angular/platform-browser';

import * as Recorder from '../../recorder/recorder';
import { StopWatchService, formatTimeSlice } from '../../services/stop-watch.service';
import { ConcatPhraseService } from '../../services/concate-phrase.service';
import { RecognitionDataService } from '../../services/recognition-data.servce';
import { MeetingsDataService } from '../../services/meetings-data.service';
import { AudioVisualizerComponent } from '../audio-visualizer/audio-visualizer.component';
import { Meeting } from '../../models/meeting';

const DEFAULT_SAMPLE_RATE = 16000;
const DEFAULT_SAMPLE_SIZE = 16;
const DEFAULT_CHANNEL_COUNT = 1;
const DEFAULT_FFT_SIZE = 128;
const DEFAULT_BUFFER_LENGTH = 4096;
// Determines how often audio will be send to speech recognition server.
// Seconds.
const DEFAULT_TIME_TO_SEND = 4;
const DEFAULT_CROSS_TIME = 2;

@Component({
    selector: 'main-page',
    templateUrl: './main-page.html',
    styleUrls: ['./main-page.scss']
})
export class MainPageComponent {
    private speechConfig: SpeechConfig;
    private speechRecognizer: SpeechRecognizer;

    private recorder: Recorder;
    private completedSamplesCount = 0;
    private timerId: any;

    @ViewChild(AudioVisualizerComponent)
    private audioVisualizer: AudioVisualizerComponent;

    public recordingInProgress = false;
    public analyser: AnalyserNode;

    public get text(): string {
        return this.concatPhraseService && this.concatPhraseService.text;
    }

    public getStopWatchString(timeSlice: number): string {
        return formatTimeSlice(timeSlice);
    }

    constructor(
        private meetingsDataService: MeetingsDataService,
        private domSanitazer: DomSanitizer,
        private concatPhraseService: ConcatPhraseService,
        private recognitionDataService: RecognitionDataService,
        public stopWatchService: StopWatchService) {
        this.speechConfig = SpeechConfig.fromSubscription('YOUR_KEY', 'northeurope');
        this.speechConfig.speechRecognitionLanguage = 'ru-RU';

        this.speechRecognizer = new SpeechRecognizer(this.speechConfig, AudioConfig.fromDefaultMicrophoneInput());
        this.speechRecognizer.recognized = (sender, event) => {
            this.concatPhraseService.appendPhrase(event.result.text);
        };
    }

    private sendDataToRecognize(data: any): Promise<void> {
        return this.recognitionDataService.recognizeAudioData(data)
            .then(recognizedText => {
                this.concatPhraseService.appendPhrase(recognizedText);
            })
            .catch(err => console.log(err));
    }

    public onRecordButtonClick(): void {
        const recorderInitializePromise = this.recorder
            ? Promise.resolve()
            : navigator.mediaDevices.getUserMedia({
                audio: {
                    channelCount: DEFAULT_CHANNEL_COUNT,
                    sampleRate: DEFAULT_SAMPLE_RATE,
                    sampleSize: DEFAULT_SAMPLE_SIZE
                }
            })
                .then((mediaStream: MediaStream) => {
                    const audioContext = new AudioContext({ sampleRate: DEFAULT_SAMPLE_RATE });
                    const sourceNode = audioContext.createMediaStreamSource(mediaStream);

                    this.analyser = audioContext.createAnalyser();
                    this.analyser.fftSize = DEFAULT_FFT_SIZE;
                    sourceNode.connect(this.analyser);

                    this.recorder = new Recorder(sourceNode, {
                        bufferLen: DEFAULT_BUFFER_LENGTH,
                        numChannels: DEFAULT_CHANNEL_COUNT,
                        mimeType: 'audio/wav',
                        sampleRate: DEFAULT_SAMPLE_RATE
                    });
                })
                .catch((error: Error) => {
                    console.log(error);
                });


        recorderInitializePromise.then(() => {
            if (this.recordingInProgress) {
                this.recordingInProgress = false;

                this.stopWatchService.stop();
                this.audioVisualizer.stop();

                clearInterval(this.timerId);

                this.recorder.stop();
                this.recorder.getBuffer((samples: Float32Array[]) => {
                    // Only 1 channel is used.
                    const recordedSamples = samples[0];
                    const samplesCount = DEFAULT_CROSS_TIME * DEFAULT_SAMPLE_RATE;
                    const startPosition = this.completedSamplesCount - samplesCount > 0
                        ? this.completedSamplesCount - samplesCount
                        : 0;
                    const lastSamples = recordedSamples.slice(startPosition);
                    this.recorder.encodeToWAV(data => {
                        this.sendDataToRecognize(data).then(() => {
                            this.recorder.exportWAV(audio => {
                                const meeting: Meeting = {
                                    id: 0,
                                    agenda: 'Test agenda',
                                    date: new Date(),
                                    audio: this.domSanitazer.bypassSecurityTrustResourceUrl(URL.createObjectURL(audio)),
                                    transcript: this.text
                                };
                                this.meetingsDataService.addMeeting(meeting);
                            },
                                'audio/wav');
                        });
                    }, lastSamples);
                });
            } else {
                this.recordingInProgress = true;

                this.stopWatchService.start();
                this.audioVisualizer.start();
                this.concatPhraseService.clearText();

                this.completedSamplesCount = 0;
                this.recorder.record();
                this.timerId = setInterval(() => {
                    this.recorder.getBuffer((samples: Float32Array[]) => {
                        // Only 1 channel is used.
                        const recordedSamples = samples[0];
                        const audioLength = DEFAULT_TIME_TO_SEND + DEFAULT_CROSS_TIME;
                        const samplesCount = audioLength * DEFAULT_SAMPLE_RATE;
                        const startPosition = recordedSamples.length - samplesCount > 0
                            ? recordedSamples.length - samplesCount
                            : 0;
                        const lastSamples = recordedSamples.slice(startPosition);
                        this.recorder.encodeToWAV(data => {
                            this.completedSamplesCount = recordedSamples.length;
                            this.sendDataToRecognize(data);
                        }, lastSamples);
                    });
                }, DEFAULT_TIME_TO_SEND * 1000);
            }
        });
    }

    // An alternative approach.
    public onRecordButtonClick2(): void {
        if (!this.recordingInProgress) {
            this.speechRecognizer.startContinuousRecognitionAsync(() => this.recordingInProgress = true);
        } else {
            this.speechRecognizer.stopContinuousRecognitionAsync(() => this.recordingInProgress = false);
        }
    }
}
