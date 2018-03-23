import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {resources} from "./resources";
import {ResourcesService} from "./resources.service";
import {MatDialog} from "@angular/material/dialog";
import {AddResourcesComponent} from "./add-resources.component";

@Component({
    selector: 'resources-component',
    templateUrl: 'resources.component.html',
    styleUrls: ['./resources.component.css'],
})
export class ResourcesComponent implements OnInit{
    // These are public so that tests can reference them (.spec.ts)
    public resources: resources[];
    public filteredResources: resources[];

    // These are the target values used in searching.
    // We should rename them to make that clearer.
    public resourcesName: string;


    // Inject the ResourcesListService into this component.
    constructor(public resourcesService: ResourcesService, public dialog: MatDialog) {

    }

    openDialog(): void {
        const newResources: resources = {_id: '', name: '', phonenumber: '', email: ''};
        const dialogRef = this.dialog.open(AddResourcesComponent, {
            width: '500px',
            data: { resources: newResources }
        });

        dialogRef.afterClosed().subscribe(result => {
            this.resourcesService.addResources(result).subscribe(
                addResourcesResult => {
                    this.refreshResources();
                },
                err => {
                    // This should probably be turned into some sort of meaningful response.
                    console.log('There was an error adding the resource.');
                    console.log('The error was ' + JSON.stringify(err));
                });
        });
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

    /**
     * Starts an asynchronous operation to update the resources list
     *
     */
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
