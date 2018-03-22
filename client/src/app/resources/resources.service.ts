
import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {Observable} from 'rxjs/Observable';

import {resources} from './resources';
import {environment} from '../../environments/environment';
import {ResourcesComponent} from "./resources.component";



@Injectable()
export class ResourcesService {
    readonly baseUrl: string = environment.API_URL + 'resources';
    private resourcesUrl: string = this.baseUrl;

    constructor(private http: HttpClient) {
    }
// Resources over resources **SIDE NOTE FOR Ahnaf, if things break its for that

    addResources(newResources: resources): Observable<{'$oid': string}> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            }),
        };
        // Send post request to add a new name with the resource data as the body with specified headers.

        return this.http.post<{'$oid': string}>(this.resourcesUrl + '/new', newResources, httpOptions);
    }

    getResourcesById(id: string): Observable<resources> {
        return this.http.get<resources>(this.resourcesUrl + '/' + id);
    }
    getResources(resourcesName?: string): Observable<resources[]> {
        if(resourcesName) {
            return this.http.get<resources[]>(this.resourcesUrl + '?name=' + resourcesName);
        }
        return this.http.get<resources[]>(this.resourcesUrl);
    }


}
