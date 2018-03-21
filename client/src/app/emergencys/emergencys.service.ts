import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {Observable} from 'rxjs/Observable';

import {environment} from '../../environments/environment';
import {Goal} from "./goals";

@Injectable()
export class GoalsService {
    readonly baseUrl: string = environment.API_URL + 'goals';
    private goalsUrl: string = this.baseUrl;

    constructor(private http: HttpClient) {
    }

    addGoal(newGoal: Goal): Observable<{'$oid': string}> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            }),
        };
        // Send post request to add a new user with the user data as the body with specified headers.
        return this.http.post<{'$oid': string}>(this.goalsUrl + '/new', newGoal, httpOptions);
    }

    getGoalById(id: string): Observable<Goal> {
        return this.http.get<Goal>(this.goalsUrl + '/' + id);
    }
    getGoals(goalOwner?: string): Observable<Goal[]> {
        if(goalOwner) {
            return this.http.get<Goal[]>(this.goalsUrl + '?owner=' + goalOwner);
        }
        return this.http.get<Goal[]>(this.goalsUrl);
    }


}
