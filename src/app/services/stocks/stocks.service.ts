import { Injectable } from '@angular/core';
import { StockApiService } from '../api/stock-api.service';
import { BehaviorSubject } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Stock } from './models/stock.model';
import { StockApi } from './models/stock.api';
import * as dayjs from 'dayjs';

@Injectable()
export class StocksService {
  dayStocks$: BehaviorSubject<Stock[]> = new BehaviorSubject<Stock[]>([]);
  currentDate$: BehaviorSubject<dayjs.Dayjs> = new BehaviorSubject<dayjs.Dayjs>(dayjs());
  dayCount$: BehaviorSubject<number> = new BehaviorSubject<number>(1);

  constructor(private stockApiService: StockApiService) {}

  get currentDate() {
    return this.currentDate$
      .pipe(map(date => date.format('dddd, MMMM DD, YYYY')));
  }

  getStocks(): void {
    this.stockApiService.fetchStocks()
      .pipe(filter(stocks => stocks !== null))
      .subscribe((stocks: StockApi[]) => {
        const initialStocks: Stock[] = stocks.map((stock: StockApi): Stock => {
          const { name, symbol, price  } = stock;
          return <Stock>{
            name, symbol,
            initialValue: price,
            currentValue: price,
            absoluteChange: 0,
            percentageOfChange: 0
          }
        });
        this.dayStocks$.next(initialStocks);
      });
  }

  getNextDayStocks() {
    this.increaseDate();
    this.increaseDayCount();
    this.nextDayStocks();
  }

  private increaseDate() {
    const currentDate = this.currentDate$.getValue();
    const nextDay = currentDate.add(1, 'day');
    this.currentDate$.next(nextDay);
  }

  private increaseDayCount() {
    let currentDayCount = this.dayCount$.getValue();
    this.dayCount$.next(currentDayCount + 1);
  }

  private nextDayStocks() {
    const currentStocks = this.dayStocks$.getValue();
    const nextDayStocks = currentStocks.map((stock: Stock) => {
      const { currentValue, initialValue } = stock;
      const change = this.getRandomNumber(-0.1, 0.1);
      const nextDayValue = currentValue + (currentValue * change);
      const percentageOfChange = this.getAbsoluteChange(initialValue, nextDayValue);
      const absoluteChange = nextDayValue - initialValue;
      return {
        ...stock,
        percentageOfChange,
        absoluteChange,
        currentValue: nextDayValue,
      }
    });
    this.dayStocks$.next(nextDayStocks);
  }

  private getRandomNumber(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  private getAbsoluteChange(initialValue: number , currentValue: number ): number {
    return (1 - (currentValue / initialValue)) * (-1);
  }
}
