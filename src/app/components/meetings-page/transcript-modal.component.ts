import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'transcript-modal',
    templateUrl: './transcript-modal.html',
    styleUrls: ['./transcript-modal.scss']
})
export class TranscriptModalComponent {

    constructor(
        public dialogRef: MatDialogRef<TranscriptModalComponent>,
        @Inject(MAT_DIALOG_DATA) public transcript: string) { }
}
