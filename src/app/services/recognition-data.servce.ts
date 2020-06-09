import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class RecognitionDataService {

    private get headers(): HttpHeaders {
        return new HttpHeaders({
            'Ocp-Apim-Subscription-Key': 'YOUR_KEY'
        });
    }

    constructor(private http: HttpClient) { }

    public recognizeAudioData(data: any): Promise<string> {
        return new Promise((resolve, reject) => {
            const headers = this.headers;
            this.http.post(
                'https://northeurope.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=ru-RU',
                data,
                {
                    headers
                }
            ).subscribe(
                (response: any) => {
                    const recognizedText = response && response.DisplayText
                        ? response.DisplayText
                        : '';
                    resolve(recognizedText);
                },
                err => reject(err));
        });
    }
}
