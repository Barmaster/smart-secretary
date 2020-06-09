import { Injectable } from '@angular/core';
import { Observable, interval, EMPTY } from 'rxjs';
import { switchMap, map, startWith } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class StopWatchService {
    private startMomentDate: Date;

    public isInProgress = false;
    public elapsedTime: Observable<number> = EMPTY.pipe(startWith(0));
    public formattedElapsedTime: Observable<string>;

    public start(): void {
        this.startMomentDate = new Date();
        this.isInProgress = true;
        this.elapsedTime = interval(1000).pipe(
            map(() => Number(new Date()) - Number(this.startMomentDate))
        );
    }

    public stop(): void {
        this.isInProgress = false;
        this.elapsedTime = EMPTY.pipe(startWith(0));
    }
}

export function formatTimeSlice(timeSlice: number): string {
    return new Date(timeSlice).toISOString().slice(11, 19);
}
