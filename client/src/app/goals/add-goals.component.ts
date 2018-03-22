import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {Goal} from './goals';

@Component({
    selector: 'app-add-goals.component',
    templateUrl: 'add-goals.component.html',
})
export class AddGoalComponent {
    constructor(
        public dialogRef: MatDialogRef<AddGoalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: {goal: Goal}) {
    }

    onNoClick(): void {
        this.dialogRef.close();
    }
}
