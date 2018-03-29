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
    public prefilteredEmojis: Emoji[];
    public chartEmojis: Emoji[];

    public startDate: any;
    public endDate: any;
    getDate: any;
    canvas: any;
    ctx: any;


    // These are the target values used in searching.
    // We should rename them to make that clearer.
    public emojiOwner: string;


    // Inject the EmojiListService into this component.
    constructor(public reportsService: ReportsService) {

    }

    public filterEmojis(searchOwner, start, end): Emoji[] {

        this.filteredEmojis = this.emojis;

        // Filter by name
        if (searchOwner != null) {
            searchOwner = searchOwner.toLocaleLowerCase();

            this.filteredEmojis = this.filteredEmojis.filter(emoji => {
                return !searchOwner || emoji.owner.toLowerCase().indexOf(searchOwner) !== -1;
            });
        }

        // Filter by startDate
        if (start != null) {

            this.filteredEmojis = this.filteredEmojis.filter(emoji => {
                this.getDate = new Date(emoji.date);
                return this.getDate >= start;
            });
        }

        // Filter by endDate
        if (end != null) {

            this.filteredEmojis = this.filteredEmojis.filter(emoji => {
                this.getDate = new Date(emoji.date);
                return this.getDate <= end;
            });
        }

        this.prefilteredEmojis = this.filteredEmojis;
        return this.filteredEmojis;
    }

    //get current date... good for debug
    getdate(): string{
        return Date();
    }

    filterChart(weekday, mood): number {
        this.chartEmojis = this.prefilteredEmojis;
        if(this.chartEmojis == null){
            this.chartEmojis = [];
        }

        // Filter by value
        this.chartEmojis = this.chartEmojis.filter(emoji => {
            return !mood.toString() || emoji.mood.toString().indexOf(mood.toString()) !== -1;
        });

        // Filter by day of the week
        this.chartEmojis = this.chartEmojis.filter(emoji => {
            return !weekday || emoji.date.indexOf(weekday) !== -1;
        });

        // return number of emojis left after filter
        return this.chartEmojis.length;
    }

    /**
     * Starts an asynchronous operation to update the emojis list
     *
     */

    buildChart(): void {

        this.canvas = document.getElementById("myChart");
        this.ctx = this.canvas;

        let days = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];

        let very_sad_daily_totals = {"label":"Very Sad",
            "data":[
                this.filterChart('Sun', '1'),
                this.filterChart('Mon', '1'),
                this.filterChart('Tue', '1'),
                this.filterChart('Wed', '1'),
                this.filterChart('Thu', '1'),
                this.filterChart('Fri', '1'),
                this.filterChart('Sat', '1')
            ],
            hidden: true,
            "fill":false,
            "borderColor":"rgb(150, 0, 100)",
            "lineTension":0.1};

        let sad_daily_totals = {"label":"Sad",
            "data":[
                this.filterChart('Sun', '2'),
                this.filterChart('Mon', '2'),
                this.filterChart('Tue', '2'),
                this.filterChart('Wed', '2'),
                this.filterChart('Thu', '2'),
                this.filterChart('Fri', '2'),
                this.filterChart('Sat', '2')
            ],
            hidden: true,
            "fill":false,
            "borderColor":"rgb(150, 75, 75)",
            "lineTension":0.1};

        let neutral_daily_totals = {"label":"Neutral",
            "data":[
                this.filterChart('Sun', '3'),
                this.filterChart('Mon', '3'),
                this.filterChart('Tue', '3'),
                this.filterChart('Wed', '3'),
                this.filterChart('Thu', '3'),
                this.filterChart('Fri', '3'),
                this.filterChart('Sat', '3')
            ],
            "fill":false,
            "borderColor":"rgb(175, 175, 175)",
            "lineTension":0.1};

        let happy_daily_totals = {"label":"Happy",
            "data":[
                this.filterChart('Sun', '4'),
                this.filterChart('Mon', '4'),
                this.filterChart('Tue', '4'),
                this.filterChart('Wed', '4'),
                this.filterChart('Thu', '4'),
                this.filterChart('Fri', '4'),
                this.filterChart('Sat', '4')
            ],
            hidden: true,
            "fill":false,
            "borderColor":"rgb(75, 192, 192)",
            "lineTension":0.1};

        let very_happy_daily_totals = {"label":"Very Happy",
            "data":[
                this.filterChart('Sun', '5'),
                this.filterChart('Mon', '5'),
                this.filterChart('Tue', '5'),
                this.filterChart('Wed', '5'),
                this.filterChart('Thu', '5'),
                this.filterChart('Fri', '5'),
                this.filterChart('Sat', '5')
            ],
            hidden: true,
            "fill":false,
            "borderColor":"rgb(200, 200, 0)",
            "lineTension":0.1};

        let negative_daily_totals = {"label":"Negative",
            "data":[
                this.filterChart('Sun', '1') + this.filterChart('Sun', '2'),
                this.filterChart('Mon', '1') + this.filterChart('Mon', '2'),
                this.filterChart('Tue', '1') + this.filterChart('Tue', '2'),
                this.filterChart('Wed', '1') + this.filterChart('Wed', '2'),
                this.filterChart('Thu', '1') + this.filterChart('Thu', '2'),
                this.filterChart('Fri', '1') + this.filterChart('Fri', '2'),
                this.filterChart('Sat', '1') + this.filterChart('Sat', '2')
            ],
            "fill":false,
            "borderColor":"rgb(250, 0, 0)",
            "lineTension":0.1};

        let positive_daily_totals = {"label":"Postive",
            "data":[
                this.filterChart('Sun', '4') + this.filterChart('Sun', '5'),
                this.filterChart('Mon', '4') + this.filterChart('Mon', '5'),
                this.filterChart('Tue', '4') + this.filterChart('Tue', '5'),
                this.filterChart('Wed', '4') + this.filterChart('Wed', '5'),
                this.filterChart('Thu', '4') + this.filterChart('Thu', '5'),
                this.filterChart('Fri', '4') + this.filterChart('Fri', '5'),
                this.filterChart('Sat', '4') + this.filterChart('Sat', '5')
            ],
            "fill":false,
            "borderColor":"rgb(0, 250, 0)",
            "lineTension":0.1};

        let myChart = new Chart(this.ctx, {
            type: 'line',
            data: {
                labels: days,
                datasets: [
                    negative_daily_totals,
                    very_sad_daily_totals,
                    sad_daily_totals,
                    neutral_daily_totals,
                    happy_daily_totals,
                    very_happy_daily_totals,
                    positive_daily_totals]
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


    ngAfterViewInit(): void {
        this.buildChart();
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
                this.filterEmojis(this.emojiOwner, this.startDate, this.endDate);
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


