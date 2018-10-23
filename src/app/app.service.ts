import {Injectable} from '@angular/core';
import {Http} from '@angular/http';

@Injectable()

export class GetChampionsTable {
  dataSource = ELEMENT_DATA;

  constructor(private http: Http) {

  }

  getWinners() {
    return this.http.get('https://supper-6fade.firebaseio.com/data.json');
  }
  saveResults() {
    return this.http.put('https://supper-6fade.firebaseio.com/data.json', {winnersTable: this.dataSource});
  }
  returnScoreTable(table) {
    this.getWinners().subscribe((response) => {
      if (response.json() !== null) {
        this.dataSource = response.json().winnersTable;
        if (table) {
        table.renderRows();
        }
      }
    });
  }
  saveScoreTable(table) {
    this.saveResults().subscribe((response) => {
      this.returnScoreTable(table);
    });
  }
}

export interface Row {
  name: string;
  score: number;
  game: string;
}

const ELEMENT_DATA: Row[] = [];
