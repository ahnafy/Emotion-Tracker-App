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


    // These are the target values used in searching.
    // We should rename them to make that clearer.
    public emojiOwner: string;


    // Inject the EmojiListService into this component.
    constructor(public reportsService: ReportsService) {

    }

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

    filterChart(weekday, mood, startdate, enddate): number {
        this.filteredEmojis = this.emojis;

        //for testing purposes, manually setting start and end date
        // this.startDate = new Date("Sun Mar 18 2018 10:00:00 GMT-0500 (CDT)");
        this.startDate = new Date("Fri Sep 24 1971 06:39:55 GMT+0000 (UTC)");
        // this.endDate = new Date("Sat Mar 24 2018 20:00:00 GMT-0500 (CDT)");
        this.endDate = new Date("Sat Mar 24 2018 20:00:00 GMT-0500 (CDT)");

        // Filter by startDate
        if (startdate != null) {

            this.filteredEmojis = this.filteredEmojis.filter(emoji => {
                this.getDate = new Date(emoji.date);
                return this.getDate >= this.startDate;
            });
        }

        // Filter by endDate
        if (enddate != null) {

            this.filteredEmojis = this.filteredEmojis.filter(emoji => {
                this.getDate = new Date(emoji.date);
                return this.getDate <= this.endDate;
            });
        }

        // Filter by value
        this.filteredEmojis = this.filteredEmojis.filter(emoji => {
            return !mood.toString() || emoji.mood.toString().indexOf(mood.toString()) !== -1;//??????
        });

        // Filter by day of the week
        this.filteredEmojis = this.filteredEmojis.filter(emoji => {
            return !weekday || emoji.date.indexOf(weekday) !== -1;
        });

        // return number of emojis left after filter
        return this.filteredEmojis.length;
    }

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
                this.filterChart('Sun', '1', this.startDate, this.endDate),
                this.filterChart('Mon', '1', this.startDate, this.endDate),
                this.filterChart('Tue', '1', this.startDate, this.endDate),
                this.filterChart('Wed', '1', this.startDate, this.endDate),
                this.filterChart('Thu', '1', this.startDate, this.endDate),
                this.filterChart('Fri', '1', this.startDate, this.endDate),
                this.filterChart('Sat', '1', this.startDate, this.endDate)
            ],
            "fill":false,
            "borderColor":"rgb(150, 0, 100)",
            "lineTension":0.1};

        let sad_daily_totals = {"label":"Sad",
            "data":[
                this.filterChart('Sun', '2', this.startDate, this.endDate),
                this.filterChart('Mon', '2', this.startDate, this.endDate),
                this.filterChart('Tue', '2', this.startDate, this.endDate),
                this.filterChart('Wed', '2', this.startDate, this.endDate),
                this.filterChart('Thu', '2', this.startDate, this.endDate),
                this.filterChart('Fri', '2', this.startDate, this.endDate),
                this.filterChart('Sat', '2', this.startDate, this.endDate)
            ],
            "fill":false,
            "borderColor":"rgb(150, 75, 75)",
            "lineTension":0.1};

        let neutral_daily_totals = {"label":"Neutral",
            "data":[
                this.filterChart('Sun', '3', this.startDate, this.endDate),
                this.filterChart('Mon', '3', this.startDate, this.endDate),
                this.filterChart('Tue', '3', this.startDate, this.endDate),
                this.filterChart('Wed', '3', this.startDate, this.endDate),
                this.filterChart('Thu', '3', this.startDate, this.endDate),
                this.filterChart('Fri', '3', this.startDate, this.endDate),
                this.filterChart('Sat', '3', this.startDate, this.endDate)
            ],
            "fill":false,
            "borderColor":"rgb(175, 175, 175)",
            "lineTension":0.1};

        let happy_daily_totals = {"label":"Happy",
            "data":[
                this.filterChart('Sun', '4', this.startDate, this.endDate),
                this.filterChart('Mon', '4', this.startDate, this.endDate),
                this.filterChart('Tue', '4', this.startDate, this.endDate),
                this.filterChart('Wed', '4', this.startDate, this.endDate),
                this.filterChart('Thu', '4', this.startDate, this.endDate),
                this.filterChart('Fri', '4', this.startDate, this.endDate),
                this.filterChart('Sat', '4', this.startDate, this.endDate)
            ],
            "fill":false,
            "borderColor":"rgb(75, 192, 192)",
            "lineTension":0.1};

        let very_happy_daily_totals = {"label":"Very Happy",
            "data":[
                this.filterChart('Sun', '5', this.startDate, this.endDate),
                this.filterChart('Mon', '5', this.startDate, this.endDate),
                this.filterChart('Tue', '5', this.startDate, this.endDate),
                this.filterChart('Wed', '5', this.startDate, this.endDate),
                this.filterChart('Thu', '5', this.startDate, this.endDate),
                this.filterChart('Fri', '5', this.startDate, this.endDate),
                this.filterChart('Sat', '5', this.startDate, this.endDate)
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


