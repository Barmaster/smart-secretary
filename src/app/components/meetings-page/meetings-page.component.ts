import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { TranscriptModalComponent } from './transcript-modal.component';
import { MeetingsDataService } from '../../services/meetings-data.service';
import { Meeting } from '../../models/meeting';

@Component({
    selector: 'meetings-page',
    templateUrl: './meetings-page.html',
    styleUrls: ['./meetings-page.scss']
})
export class MeetingsPageComponent implements OnInit {

    public displayedColumns: string[] = ['id', 'agenda', 'date', 'audio', 'actions'];
    public dataSource: Meeting[];

    constructor(
        public dialog: MatDialog,
        private meetingsDataService: MeetingsDataService) { }

    public ngOnInit(): void {
        this.meetingsDataService.getMeetings()
            .then(meetings => this.dataSource = meetings);
    }

    public openDialog(meeting: Meeting): void {
        const dialogRef = this.dialog.open(TranscriptModalComponent, {
            width: '100%',
            data: meeting.transcript
        });

        dialogRef.afterClosed().subscribe(transcript => {
            if (transcript) {
                meeting.transcript = transcript;
                this.meetingsDataService.updateMeeting(meeting);
            }
        });
    }
}
