import {Component} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {resources} from "./resources";
import {ResourcesService} from "./resources.service";
import {MatDialog} from "@angular/material/dialog";


@Component({
    selector: 'resources-component',
    templateUrl: 'resources.component.html',
    styleUrls: ['./resources.component.css'],
})
export class ResourcesComponent {
    public title: string;

    constructor() {
        this.title = 'Resources';
    }
}
