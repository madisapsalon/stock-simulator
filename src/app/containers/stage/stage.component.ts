import { Component, OnDestroy, OnInit } from '@angular/core';
import { StocksService } from '../../services/stocks/stocks.service';
import { Subscription } from 'rxjs';
import { Stock } from '../../services/stocks/models/stock.model';

@Component({
  selector: 'app-stage',
  templateUrl: './stage.component.html',
  styleUrls: ['./stage.component.scss']
})
export class StageComponent implements OnInit, OnDestroy {
  private subscription$: Subscription = new Subscription();
  stocks: Stock[] = [];
  currentDate$ = this.stocksService.currentDate;
  dayCount$ = this.stocksService.dayCount$;
  displayedColumns: string[] = ['name', 'symbol', 'initialValue', 'currentValue', 'percentageOfChange'];

  constructor(private stocksService: StocksService) {}

  ngOnInit() {
    this.stocksService.getStocks();
    this.subscription$ = this.stocksService.dayStocks$
      .subscribe((stocks) => {
        this.stocks = stocks;
      });
  }

  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }

  passDay() {
    this.stocksService.getNextDayStocks();
  }
}
