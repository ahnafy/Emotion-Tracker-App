import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {MatDialog} from "@angular/material/dialog";
import {ResourcesService} from "./resources.service";
import {resources} from "./resources";
import {Observable} from "rxjs/Observable";

@Component({
    selector: 'app-crisis-button.component',
    templateUrl: 'crisis-button.component.html',
})
export class CrisisButtonComponent implements OnInit{
    public resources: resources[];

    // These are the target values used in searching.
    // We should rename them to make that clearer.
    public resourcesName: string;
    public filteredResources: resources[];

    constructor(
        public dialogRef: MatDialogRef<CrisisButtonComponent>, public resourcesService: ResourcesService, public dialog: MatDialog) {
    }

    public filterResources(searchName): resources[] {

        this.filteredResources = this.resources;

        // Filter by name
        if (searchName != null) {
            searchName = searchName.toLocaleLowerCase();

            this.filteredResources = this.filteredResources.filter(resources => {
                return !searchName || resources.name.toLowerCase().indexOf(searchName) !== -1;
            });
        }
        return this.filteredResources;
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    refreshResources(): Observable<resources[]> {
        // Get Resources returns an Observable, basically a "promise" that
        // we will get the data from the server.
        //
        // Subscribe waits until the data is fully downloaded, then
        // performs an action on it (the first lambda)

        const resourcesListObservable: Observable<resources[]> = this.resourcesService.getResources();
        resourcesListObservable.subscribe(
            resources => {
                this.resources = resources;
                this.filterResources(this.resourcesName);
            },
            err => {
                console.log(err);
            });
        return resourcesListObservable;
    }

    ngOnInit(): void {
        this.refreshResources();
    }
}
