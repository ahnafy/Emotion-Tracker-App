import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {Journal} from './journal';

@Component({
    selector: 'app-add-journal.component',
    templateUrl: 'add-journal.component.html',
})

export class AddJournalComponent {
    constructor(
        public dialogRef: MatDialogRef<AddJournalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: {journal: Journal}) {
    }

    onNoClick(): void {
        this.dialogRef.close();
    }
}
