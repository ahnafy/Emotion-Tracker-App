import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {Emergency} from "./emergencys";
import {EmergencyService} from "./emergencys.service";
import {MatDialog} from "@angular/material/dialog";
import {AddEmergencyComponent} from "./add-emergencys.component";

@Component({
    selector: 'app-emergencys-component',
    templateUrl: './emergencys.component.html',
    styleUrls: ['./emergencys.component.css']
})
export class EmergencysComponent implements OnInit{
    // These are public so that tests can reference them (.spec.ts)
    public emergencys: Emergency[];
    public filteredEmergencys: Emergency[];

    // These are the target values used in searching.
    // We should rename them to make that clearer.
    public emergencyName: string;


    // Inject the GoalListService into this component.
    constructor(public emergencysService: EmergencyService, public dialog: MatDialog) {

    }

    openDialog(): void {
        const newEmergency: Emergency = {_id: '', name: '', email: '', phonenumber: ''};
        const dialogRef = this.dialog.open(AddEmergencyComponent, {
            width: '500px',
            data: { emergency: newEmergency }
        });

        dialogRef.afterClosed().subscribe(result => {
            this.emergencysService.addemergency(result).subscribe(
                addEmergencyResult => {
                    this.refreshEmergencys();
                },
                err => {
                    // This should probably be turned into some sort of meaningful response.
                    console.log('There was an error adding the emergency.');
                    console.log('The error was ' + JSON.stringify(err));
                });
        });
    }


    public filterEmergencys(searchName): Emergency[] {

        this.filteredEmergencys = this.emergencys;

        // Filter by name
        if (searchName != null) {
            searchName = searchName.toLocaleLowerCase();

            this.filteredEmergencys = this.filteredEmergencys.filter(emergency => {
                return !searchName || emergency.name.toLowerCase().indexOf(searchName) !== -1;
            });
        }


        return this.filteredEmergencys;
    }

    /**
     * Starts an asynchronous operation to update the goals list
     *
     */
    refreshEmergencys(): Observable<Emergency[]> {
        // Get Goals returns an Observable, basically a "promise" that
        // we will get the data from the server.
        //
        // Subscribe waits until the data is fully downloaded, then
        // performs an action on it (the first lambda)

        const emergencyListObservable: Observable<Emergency[]> = this.emergencysService.getEmergencys();
        emergencyListObservable.subscribe(
            emergencys => {
                this.emergencys = emergencys;
                this.filterEmergencys(this.emergencyName);
            },
            err => {
                console.log(err);
            });
        return emergencyListObservable;
    }


    ngOnInit(): void {
        this.refreshEmergencys();
    }
}
