import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {HttpClient} from '@angular/common/http';

import {Journal} from './journal';
import {JournalListService} from './journal-list.service';

describe('Journal list service: ', () => {
    // A small collection of test journals
    const testJournals: Journal[] = [
        {
            _id: 'sat_id',
            subject: "My busy Saturday",
            body: "What a busy day today!  I never had a moment’s rest.  The day started with my alarm clock blaring at 7am.  I had to be at the Smith’s house by 8am to baby-sit. I really didn’t want to wake up so early on a Saturday, but I’m saving money to buy a new iPod and couldn’t say no to an all-day babysitting job.",
            date: ''
        },
        {
            _id: 'song_id',
            subject: "I listened to this great song today",
            body: "Good friends we have. Oh. Good friends we have lost along the way. Yeah! In this great future you cant forget your past. So dry your tears, I say. Yeah.",
            date: ''
        },
        {
            _id: 'wed_id',
            subject: "Wednesday",
            body: "Today was an okay day.",
            date: ''
        }
    ];
    const wJournals: Journal[] = testJournals.filter(journal =>
        journal.subject.toLowerCase().indexOf('W') !== -1
    );

    // We will need some url information from the journalListService to meaningfully test subject filtering;
    // https://stackoverflow.com/questions/35987055/how-to-write-unit-testing-for-angular-2-typescript-for-private-methods-with-ja
    let journalListService: JournalListService;
    let currentlyImpossibleToGenerateSearchJournalUrl: string;

    // These are used to mock the HTTP requests so that we (a) don't have to
    // have the server running and (b) we can check exactly which HTTP
    // requests were made to ensure that we're making the correct requests.
    let httpClient: HttpClient;
    let httpTestingController: HttpTestingController;

    beforeEach(() => {
        // Set up the mock handling of the HTTP requests
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule]
        });
        httpClient = TestBed.get(HttpClient);
        httpTestingController = TestBed.get(HttpTestingController);
        // Construct an instance of the service with the mock
        // HTTP client.
        journalListService = new JournalListService(httpClient);
    });

    afterEach(() => {
        // After every test, assert that there are no more pending requests.
        httpTestingController.verify();
    });

    it('getJournals() calls api/journals', () => {
        // Assert that the journals we get from this call to getJournals()
        // should be our set of test journals. Because we're subscribing
        // to the result of getJournals(), this won't actually get
        // checked until the mocked HTTP request "returns" a response.
        // This happens when we call req.flush(testJournals) a few lines
        // down.
        journalListService.getJournals().subscribe(
            journals => expect(journals).toBe(testJournals)
        );

        // Specify that (exactly) one request will be made to the specified URL.
        const req = httpTestingController.expectOne(journalListService.baseUrl);
        // Check that the request made to that URL was a GET request.
        expect(req.request.method).toEqual('GET');
        // Specify the content of the response to that request. This
        // triggers the subscribe above, which leads to that check
        // actually being performed.
        req.flush(testJournals);
    });

    it('getJournals(journalSubject) adds appropriate param string to called URL', () => {
        journalListService.getJournals('W').subscribe(
            journals => expect(journals).toEqual(wJournals)
        );

        const req = httpTestingController.expectOne(journalListService.baseUrl + '?subject=W&');
        expect(req.request.method).toEqual('GET');
        req.flush(wJournals);
    });

    it('filterBySubject(journalSubject) deals appropriately with a URL that already had a subject', () => {
        currentlyImpossibleToGenerateSearchJournalUrl = journalListService.baseUrl + '?subject=w&something=k&';
        journalListService['journalUrl'] = currentlyImpossibleToGenerateSearchJournalUrl;
        journalListService.filterBySubject('w');
        expect(journalListService['journalUrl']).toEqual(journalListService.baseUrl + '?something=k&subject=w&');
    });

    it('filterBySubject(journalSubject) deals appropriately with a URL that already had some filtering, but no subject', () => {
        currentlyImpossibleToGenerateSearchJournalUrl = journalListService.baseUrl + '?something=k&';
        journalListService['journalUrl'] = currentlyImpossibleToGenerateSearchJournalUrl;
        journalListService.filterBySubject('w');
        expect(journalListService['journalUrl']).toEqual(journalListService.baseUrl + '?something=k&subject=w&');
    });

    it('filterBySubject(journalSubject) deals appropriately with a URL has the keyword subject, but nothing after the =', () => {
        currentlyImpossibleToGenerateSearchJournalUrl = journalListService.baseUrl + '?subject=&';
        journalListService['journalUrl'] = currentlyImpossibleToGenerateSearchJournalUrl;
        journalListService.filterBySubject('');
        expect(journalListService['journalUrl']).toEqual(journalListService.baseUrl + '');
    });

    it('getJournalById() calls api/journals/id', () => {
        const targetJournal: Journal = testJournals[1];
        const targetId: string = targetJournal._id;
        journalListService.getJournalById(targetId).subscribe(
            journal => expect(journal).toBe(targetJournal)
        );

        const expectedUrl: string = journalListService.baseUrl + '/' + targetId;
        const req = httpTestingController.expectOne(expectedUrl);
        expect(req.request.method).toEqual('GET');
        req.flush(targetJournal);
    });

    it('adding a journal calls api/journals/new', () => {
        const jesse_id = { '$oid': 'jesse_id' };
        const newJournal: Journal = {
            _id: '58af3a600343927e48e87257',
            subject: "Master pass plz",
            body: "good grade plz",
            date: ''
        };

        journalListService.addNewJournal(newJournal).subscribe(
            id => {
                expect(id).toBe(jesse_id);
            }
        );

        const expectedUrl: string = journalListService.baseUrl + '/new';
        const req = httpTestingController.expectOne(expectedUrl);
        console.log(req);
        expect(req.request.method).toEqual('POST');
        req.flush(jesse_id);
    });
});
