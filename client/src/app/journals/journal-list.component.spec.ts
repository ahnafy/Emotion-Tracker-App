import {ComponentFixture, TestBed, async} from '@angular/core/testing';
import {JournalListComponent} from "./journal-list.component";
import {Observable} from 'rxjs/Observable';
import {FormsModule} from '@angular/forms';
import {CustomModule} from '../custom.module';
import {MATERIAL_COMPATIBILITY_MODE} from '@angular/material';
import {MatDialog} from '@angular/material';
import {JournalListService} from "./journal-list.service";
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import {Journal} from "./journal";

describe('Journal list', () => {

    let journalList: JournalListComponent;
    let fixture: ComponentFixture<JournalListComponent>;

    let JournalListServiceStub: {
        getJournals: () => Observable<Journal[]>
    };

    beforeEach(() => {
        // stub ReportsService for test purposes
        JournalListServiceStub = {
            getJournals: () => Observable.of([
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
            ])
        };

        TestBed.configureTestingModule({
            imports: [CustomModule],
            declarations: [JournalListComponent],
            // providers:    [ UserListService ]  // NO! Don't provide the real service!
            // Provide a test-double instead
            providers: [{provide: JournalListService, useValue: JournalListServiceStub},
                {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(JournalListComponent);
            journalList = fixture.componentInstance;
            fixture.detectChanges();
        });
    }));

    it('contains all the journals', () => {
        expect(journalList.journals.length).toBe(3);
    });

    it('contains a subject \'Wednesday\'', () => {
        expect(journalList.journals.some((journal: Journal) => journal.subject=== 'Wednesday')).toBe(true);
    });

    it('contain a subject \'My busy Saturday\'', () => {
        expect(journalList.journals.some((journal: Journal) => journal.subject=== 'My busy Saturday')).toBe(true);
    });

    it('doesn\'t contain a subject \'Santa\'', () => {
        expect(journalList.journals.some((journal: Journal) => journal.subject=== 'Santa')).toBe(false);
    });


    it('journal list filters by subject', () => {
        console.log(journalList.journals)
        expect(journalList.filteredJournals.length).toBe(3);
        journalList.journalSubject= 'Wed';
        journalList.refreshJournals().subscribe(() => {
            expect(journalList.filteredJournals.length).toBe(1);
        });
    });


});

describe('Misbehaving Journal List', () => {
    let journalList: JournalListComponent;
    let fixture: ComponentFixture<JournalListComponent>;

    let journalListServiceStub: {
        getJournals: () => Observable<Journal[]>
    };

    beforeEach(() => {
        // stub UserService for test purposes
        journalListServiceStub = {
            getJournals: () => Observable.create(observer => {
                observer.error('Error-prone observable');
            })
        };

        TestBed.configureTestingModule({
            imports: [FormsModule, CustomModule],
            declarations: [JournalListComponent],
            providers: [{provide: JournalListService, useValue: journalListServiceStub},
                {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(JournalListComponent);
            journalList = fixture.componentInstance;
            fixture.detectChanges();
        });
    }));

    it('generates an error if we don\'t set up a JournalListService', () => {
        // Since the observer throws an error, we don't expect users to be defined.
        expect(journalList.journals).toBeUndefined();
    });
});



