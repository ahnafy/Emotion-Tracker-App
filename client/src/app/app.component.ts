import {Component} from '@angular/core';
import {CrisisButtonComponent} from "./resources/crisis-button.component";
import {MatDialog} from '@angular/material';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'Sunshine Journal';


constructor(public dialog: MatDialog) {

}

openDialog(): void{
    const dialogRef = this.dialog.open(CrisisButtonComponent,{
        width: '500px',
        height: '500px'
    });
}
}
