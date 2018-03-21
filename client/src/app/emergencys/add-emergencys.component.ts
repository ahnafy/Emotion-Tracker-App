import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {Emergency} from './emergencys';

@Component({
    selector: 'app-add-emergencys.component',
    templateUrl: 'add-emergencys.component.html',
})
export class AddEmergencyComponent {
    constructor(
        public dialogRef: MatDialogRef<AddEmergencyComponent>,
        @Inject(MAT_DIALOG_DATA) public data: {emergency: Emergency}) {
    }

    onNoClick(): void {
        this.dialogRef.close();
    }
}
