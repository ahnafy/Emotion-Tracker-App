import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Emoji} from "../emoji";
import {ReportsService} from "../reports/reports.service";
//import {Chart} from 'chart.js';
import * as Chart from 'chart.js';


@Component({
    selector: 'charts-component',
    templateUrl: 'charts.component.html',
    styleUrls: ['./charts.component.css'],
})

export class ChartsComponent implements AfterViewInit {
    // These are public so that tests can reference them (.spec.ts)
    public emojis: Emoji[];
    public filteredEmojis: Emoji[];

    startDate;
    endDate;
    getDate;
    myChart: any;
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
/*
    public filterEmojis(searchOwner): Emoji[] {

        this.filteredEmojis = this.emojis;

        // Filter by name
        if (searchOwner != null) {
            searchOwner = searchOwner.toLocaleLowerCase();

            this.filteredEmojis = this.filteredEmojis.filter(emoji => {
                return !searchOwner || emoji.owner.toLowerCase().indexOf(searchOwner) !== -1;
            });
        }

        // Sort by date
        this.filteredEmojis = this.filteredEmojis.sort((emoji1, emoji2) => {
            const date1 = new Date(emoji1.date);
            const date2 = new Date(emoji2.date);
            return date2.valueOf() - date1.valueOf();
        });


        return this.filteredEmojis;
    } */

    //get current date... good for debug

    getdate(): string{
        return Date();
    }

    public filterWeek(searchStartDate, searchEndDate): Emoji[] {
        this.filteredEmojis = this.emojis;

        //for testing purposes, manually setting start and end date
        this.startDate = new Date("Sun Mar 18 2018 10:00:00 GMT-0500 (CDT)");
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
                //this.filterEmojis(this.emojiOwner);
            },
            err => {
                console.log(err);
            });
        return emojiListObservable;
    }



    ngAfterViewInit(): void {
        var ctx = document.getElementById("myChart");
        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
                datasets: [{
                    label: '# of Votes',
                    data: [12, 19, 3, 5, 2, 3],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255,99,132,1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
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

}


