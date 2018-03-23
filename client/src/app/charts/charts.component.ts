import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Emoji} from "../emoji";
import {ReportsService} from "../reports/reports.service";

import * as Chart from 'chart.js';


@Component({
    selector: 'charts-component',
    templateUrl: 'charts.component.html',
    styleUrls: ['./charts.component.css'],
})

export class ChartsComponent implements AfterViewInit, OnInit{
    // These are public so that tests can reference them (.spec.ts)
    public emojis: Emoji[];
    public filteredEmojis: Emoji[];

    startDate;
    endDate;
    getDate;
    canvas: any;
    ctx: any;

    public week_chart: any;



    // These are the target values used in searching.
    // We should rename them to make that clearer.
    public emojiOwner: string;


    // Inject the EmojiListService into this component.
    constructor(public reportsService: ReportsService) {

    }
/*
    public filterDates(searchMood: string, searchStartDate: any, searchEndDate: any): Summary[] {

        this.filteredSummarys = this.summarys;

        // Filter by Mood
        if (searchMood != null) {
            searchMood = searchMood.toLocaleLowerCase();

            this.filteredSummarys = this.filteredSummarys.filter(summary => {
                return !searchMood || summary.mood.toLowerCase().indexOf(searchMood) !== -1;
            });
        }

        // Filter by startDate
        if (searchStartDate != null) {

            this.filteredSummarys = this.filteredSummarys.filter(summary => {
                this.getDate = new Date(summary.date);
                return this.getDate >= this.startDate;
            });
        }

        // Filter by endDate
        if (searchEndDate != null) {

            this.filteredSummarys = this.filteredSummarys.filter(summary => {
                this.getDate = new Date(summary.date);
                return this.getDate <= this.endDate;
            });
        }

        return this.filteredSummarys;
    }
    */

    public filterEmojis(searchOwner): Emoji[] {

        this.filteredEmojis = this.emojis;

        // Filter by name
        if (searchOwner != null) {
            searchOwner = searchOwner.toLocaleLowerCase();

            this.filteredEmojis = this.filteredEmojis.filter(emoji => {
                return !searchOwner || emoji.owner.toLowerCase().indexOf(searchOwner) !== -1;
            });
        }

        return this.filteredEmojis;
    }

    //get current date... good for debug

    getdate(): string{
        return Date();
    }

    public filterWeek(searchStartDate, searchEndDate): Emoji[] {
        this.filteredEmojis = this.emojis;

        //for testing purposes, manually setting start and end date
       // this.startDate = new Date("Sun Mar 18 2018 10:00:00 GMT-0500 (CDT)");
        this.startDate = new Date("Fri Sep 24 1971 06:39:55 GMT+0000 (UTC)");
       // this.endDate = new Date("Sat Mar 24 2018 20:00:00 GMT-0500 (CDT)");
        this.endDate = new Date("Sat Mar 24 2018 20:00:00 GMT-0500 (CDT)");

        // Filter by startDate
        if (searchStartDate != null) {

            this.filteredEmojis = this.filteredEmojis.filter(emoji => {
                this.getDate = new Date(emoji.date);
                return this.getDate >= this.startDate;
            });
        }

        // Filter by endDate
        if (searchEndDate != null) {

            this.filteredEmojis = this.filteredEmojis.filter(emoji => {
                this.getDate = new Date(emoji.date);
                return this.getDate <= this.endDate;
            });
        }
        return this.filteredEmojis;
    }


    public filterMood(mood, partiallyFilteredEmotions): Emoji[] {

        this.filteredEmojis = partiallyFilteredEmotions;

        // Filter by value
        this.filteredEmojis = this.filteredEmojis.filter(emoji => {
            return !mood.toString() || emoji.mood.toString().indexOf(mood.toString()) !== -1;//??????
        });


        return this.filteredEmojis;
    }
    public numberByDay(weekday, partiallyFilteredEmotions): number {

        this.filteredEmojis = partiallyFilteredEmotions;

        // Filter by day of the week
        this.filteredEmojis = this.filteredEmojis.filter(emoji => {
            return !weekday || emoji.date.indexOf(weekday) !== -1;
        });

        console.log(typeof this.filteredEmojis.length);
        return this.filteredEmojis.length;
    }

    public static returnfive(): number {
        return 5;
    }
/*
    public getchart() {
        this.week_chart = document.getElementById('week-chart');
        var days = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];
// var happy_daily_totals = [4, 3, 6, 1, 2, 3];
// var bob=returnfive();
//  happy_daily_totals=unshift(bob,happy_daily_totals);
// console.log(happy_daily_totals);


        var happy_daily_totals = [5, 4, 3, 6, 1, 2, 3];
        var sad_daily_totals = [6, 7, 3, 1, 5, 4, 3];

        var happy_data = {
            x: days,
            y: happy_daily_totals,
            type: 'scatter',
            name: 'Happy'
        };

        var sad_data = {
            x: days,
            y: sad_daily_totals,
            type: 'scatter',
            name: 'Sad'
        };

        var layout = {
            title: 'This Week\'s Emotions'
        };

        var full_data = [happy_data, sad_data];

         Plotly.plot(this.week_chart, full_data, layout);
    }*/
    /**
     * Starts an asynchronous operation to update the emojis list
     *
     */

    ngAfterViewInit(): void {
        this.canvas = document.getElementById("myChart");
        this.ctx = this.canvas;

        let days = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];

        let very_sad_daily_totals = {"label":"Very Sad",
            "data":[
                this.numberByDay('Sun', this.filterMood('1', this.filterWeek(this.startDate, this.endDate))),
                this.numberByDay('Mon', this.filterMood('1', this.filterWeek(this.startDate, this.endDate))),
                this.numberByDay('Tue', this.filterMood('1', this.filterWeek(this.startDate, this.endDate))),
                this.numberByDay('Wed', this.filterMood('1', this.filterWeek(this.startDate, this.endDate))),
                this.numberByDay('Thu', this.filterMood('1', this.filterWeek(this.startDate, this.endDate))),
                this.numberByDay('Fri', this.filterMood('1', this.filterWeek(this.startDate, this.endDate))),
                this.numberByDay('Sat', this.filterMood('1', this.filterWeek(this.startDate, this.endDate)))
            ],
            "fill":false,
            "borderColor":"rgb(150, 0, 100)",
            "lineTension":0.1};

        let sad_daily_totals = {"label":"Sad",
            "data":[
                this.numberByDay('Sun', this.filterMood('2', this.filterWeek(this.startDate, this.endDate))),
                this.numberByDay('Mon', this.filterMood('2', this.filterWeek(this.startDate, this.endDate))),
                this.numberByDay('Tue', this.filterMood('2', this.filterWeek(this.startDate, this.endDate))),
                this.numberByDay('Wed', this.filterMood('2', this.filterWeek(this.startDate, this.endDate))),
                this.numberByDay('Thu', this.filterMood('2', this.filterWeek(this.startDate, this.endDate))),
                this.numberByDay('Fri', this.filterMood('2', this.filterWeek(this.startDate, this.endDate))),
                this.numberByDay('Sat', this.filterMood('2', this.filterWeek(this.startDate, this.endDate)))
            ],
            "fill":false,
            "borderColor":"rgb(150, 75, 75)",
            "lineTension":0.1};

        let neutral_daily_totals = {"label":"Neutral",
            "data":[
                this.numberByDay('Sun', this.filterMood('3', this.filterWeek(this.startDate, this.endDate))),
                this.numberByDay('Mon', this.filterMood('3', this.filterWeek(this.startDate, this.endDate))),
                this.numberByDay('Tue', this.filterMood('3', this.filterWeek(this.startDate, this.endDate))),
                this.numberByDay('Wed', this.filterMood('3', this.filterWeek(this.startDate, this.endDate))),
                this.numberByDay('Thu', this.filterMood('3', this.filterWeek(this.startDate, this.endDate))),
                this.numberByDay('Fri', this.filterMood('3', this.filterWeek(this.startDate, this.endDate))),
                this.numberByDay('Sat', this.filterMood('3', this.filterWeek(this.startDate, this.endDate)))
            ],
            "fill":false,
            "borderColor":"rgb(175, 175, 175)",
            "lineTension":0.1};

        let happy_daily_totals = {"label":"Happy",
            "data":[
                this.numberByDay('Sun', this.filterMood('4', this.filterWeek(this.startDate, this.endDate))),
                this.numberByDay('Mon', this.filterMood('4', this.filterWeek(this.startDate, this.endDate))),
                this.numberByDay('Tue', this.filterMood('4', this.filterWeek(this.startDate, this.endDate))),
                this.numberByDay('Wed', this.filterMood('4', this.filterWeek(this.startDate, this.endDate))),
                this.numberByDay('Thu', this.filterMood('4', this.filterWeek(this.startDate, this.endDate))),
                this.numberByDay('Fri', this.filterMood('4', this.filterWeek(this.startDate, this.endDate))),
                this.numberByDay('Sat', this.filterMood('4', this.filterWeek(this.startDate, this.endDate)))
            ],
            "fill":false,
            "borderColor":"rgb(75, 192, 192)",
            "lineTension":0.1};

        let very_happy_daily_totals = {"label":"Very Happy",
            "data":[
                this.numberByDay('Sun', this.filterMood('5', this.filterWeek(this.startDate, this.endDate))),
                this.numberByDay('Mon', this.filterMood('5', this.filterWeek(this.startDate, this.endDate))),
                this.numberByDay('Tue', this.filterMood('5', this.filterWeek(this.startDate, this.endDate))),
                this.numberByDay('Wed', this.filterMood('5', this.filterWeek(this.startDate, this.endDate))),
                this.numberByDay('Thu', this.filterMood('5', this.filterWeek(this.startDate, this.endDate))),
                this.numberByDay('Fri', this.filterMood('5', this.filterWeek(this.startDate, this.endDate))),
                this.numberByDay('Sat', this.filterMood('5', this.filterWeek(this.startDate, this.endDate)))
            ],
            "fill":false,
            "borderColor":"rgb(200, 200, 0)",
            "lineTension":0.1};

        let myChart = new Chart(this.ctx, {
            type: 'line',
            data: {
                labels: days,
                datasets: [very_sad_daily_totals,
                    sad_daily_totals,
                    neutral_daily_totals,
                    happy_daily_totals,
                    very_happy_daily_totals]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero:true
                        }
                    }]
                }
            }
        });
    }

    refreshEmojis(): Observable<Emoji[]> {
        // Get Emojis returns an Observable, basically a "promise" that
        // we will get the data from the server.
        //
        // Subscribe waits until the data is fully downloaded, then
        // performs an action on it (the first lambda)

        const emojiListObservable: Observable<Emoji[]> = this.reportsService.getEmojis();
        emojiListObservable.subscribe(
            emojis => {
                this.emojis = emojis;
                this.filterEmojis(this.emojiOwner);
            },
            err => {
                console.log(err);
            });
        return emojiListObservable;
    }


    ngOnInit(): void {
        this.refreshEmojis();
    }

}


