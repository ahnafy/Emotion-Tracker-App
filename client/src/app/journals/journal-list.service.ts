import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {Observable} from 'rxjs/Observable';

import {Journal} from './journal';
import {environment} from '../../environments/environment';


@Injectable()
export class JournalListService {
    readonly baseUrl: string = environment.API_URL + 'journals';
    private journalUrl: string = this.baseUrl;

    constructor(private http: HttpClient) {
    }

    getJournals(journalSubject?: string): Observable<Journal[]> {
        this.filterBySubject(journalSubject);
        return this.http.get<Journal[]>(this.journalUrl);
    }

    getJournalById(id: string): Observable<Journal> {
        return this.http.get<Journal>(this.journalUrl + '/' + id);
    }

    /*
    //This method looks lovely and is more compact, but it does not clear previous searches appropriately.
    //It might be worth updating it, but it is currently commented out since it is not used (to make that clear)
    getUsersByCompany(userCompany?: string): Observable<User> {
        this.userUrl = this.userUrl + (!(userCompany == null || userCompany == "") ? "?company=" + userCompany : "");
        console.log("The url is: " + this.userUrl);
        return this.http.request(this.userUrl).map(res => res.json());
    }
    */

    filterBySubject(journalSubject?: string): void {
        if (!(journalSubject == null || journalSubject === '')) {
            if (this.parameterPresent('subject=') ) {
                // there was a previous search by company that we need to clear
                this.removeParameter('subject=');
            }
            if (this.journalUrl.indexOf('?') !== -1) {
                // there was already some information passed in this url
                this.journalUrl += 'subject=' + journalSubject + '&';
            } else {
                // this was the first bit of information to pass in the url
                this.journalUrl += '?subject=' + journalSubject + '&';
            }
        } else {
            // there was nothing in the box to put onto the URL... reset
            if (this.parameterPresent('subject=')) {
                let start = this.journalUrl.indexOf('subject=');
                const end = this.journalUrl.indexOf('&', start);
                if (this.journalUrl.substring(start - 1, start) === '?') {
                    start = start - 1;
                }
                this.journalUrl = this.journalUrl.substring(0, start) + this.journalUrl.substring(end + 1);
            }
        }
    }

    private parameterPresent(searchParam: string) {
        return this.journalUrl.indexOf(searchParam) !== -1;
    }

    // remove the parameter and, if present, the &
    private removeParameter(searchParam: string) {
        const start = this.journalUrl.indexOf(searchParam);
        let end = 0;
        if (this.journalUrl.indexOf('&') !== -1) {
            end = this.journalUrl.indexOf('&', start) + 1;
        } else {
            end = this.journalUrl.indexOf('&', start);
        }
        this.journalUrl = this.journalUrl.substring(0, start) + this.journalUrl.substring(end);
    }

    addNewJournal(newJournal : Journal): Observable<{'$oid': string}> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            }),
        };

        // Send post request to add a new journal with the journal data as the body with specified headers.
        return this.http.post<{'$oid': string}>(this.journalUrl + '/new', newJournal, httpOptions);
    }

    editJournal(id: string): Observable<{'$oid': string}> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            }),
        };

        console.log(id);
        // Send post request to add a new journal with the journal data as the body with specified headers.
        return this.http.post<{'$oid': string}>(this.journalUrl + '/edit', id, httpOptions);
    }
}
