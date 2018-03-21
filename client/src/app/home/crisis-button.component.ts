import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material';

@Component({
    selector: 'app-crisis-button.component',
    templateUrl: 'crisis-button.component.html',
})
export class CrisisButtonComponent {
    constructor(
        public dialogRef: MatDialogRef<CrisisButtonComponent>) {
    }

    onNoClick(): void {
        this.dialogRef.close();
    }
}
