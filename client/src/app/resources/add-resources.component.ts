import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {resources} from './resources';

@Component({
    selector: 'app-add-resources.component',
    templateUrl: 'add-resources.component.html',
})
export class AddResourcesComponent {
    constructor(
        public dialogRef: MatDialogRef<AddResourcesComponent>,
        @Inject(MAT_DIALOG_DATA) public data: {resources: resources}) {
    }

    onNoClick(): void {
        this.dialogRef.close();
    }
}
