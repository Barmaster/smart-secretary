import { Injectable } from '@angular/core';
import { Meeting } from '../models/meeting';

const DEFAULT__MEETINGS: Meeting[] = [
    {
        id: 5435, agenda: 'Выпуск новой версии продукта SmartDB', date: new Date(),
        audio: 'https://interactive-examples.mdn.mozilla.net/media/examples/t-rex-roar.mp3', transcript: 'H'
    },
    {
        id: 5436, agenda: 'Рассмотрение проекта комплексных изменений процесса', date: new Date(),
        audio: 'https://interactive-examples.mdn.mozilla.net/media/examples/t-rex-roar.mp3', transcript: 'He'
    },
    {
        id: 5437, agenda: 'Оперативное совещание по аренде помещений', date: new Date(),
        audio: 'https://interactive-examples.mdn.mozilla.net/media/examples/t-rex-roar.mp3', transcript: 'Li'
    },
    {
        id: 5438, agenda: 'Beryllium', date: new Date(),
        audio: 'https://interactive-examples.mdn.mozilla.net/media/examples/t-rex-roar.mp3', transcript: 'Be'
    },
    {
        id: 5439, agenda: 'Boron', date: new Date(),
        audio: 'https://interactive-examples.mdn.mozilla.net/media/examples/t-rex-roar.mp3', transcript: 'B'
    }
];

@Injectable({
    providedIn: 'root'
})
export class MeetingsDataService {

    private source: Meeting[] = DEFAULT__MEETINGS;

    public getMeetings(): Promise<Meeting[]> {
        // Why not? It is fake service anyway.
        const clone: Meeting[] = JSON.parse(JSON.stringify(this.source));
        clone.forEach(c => {
            c.audio = this.source.find(m => m.id === c.id).audio;
        });
        return Promise.resolve(clone);
    }

    public addMeeting(meeting: Meeting): Promise<void> {
        meeting.id = Math.max(...this.source.map(m => m.id)) + 1;
        this.source.push(meeting);
        return Promise.resolve();
    }

    public updateMeeting(meeting: Meeting): Promise<void> {
        const meetingToUpdateIndex = this.source.findIndex(m => m.id === meeting.id);
        if (meetingToUpdateIndex >= 0) {
            this.source[meetingToUpdateIndex] = meeting;
        }
        return Promise.resolve();
    }
}
