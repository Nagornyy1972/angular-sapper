import {Component, ViewChild} from '@angular/core';
import {GetChampionsTable} from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public rows = 15;
  public columns = 22;
  public maxMines = 99;
  public rendCoefficient = this.maxMines / (this.rows * this.columns);
  public cells = [];
  public gameStarted = false;
  public timer = 0;
  public timeout;
  public player = 'Player';
  public stackCells = [];
  public canSave;
  public leftCells;
  public result;
  public markedMines = 0;
  @ViewChild('table') table;
  displayedColumns: string[] = ['position', 'name'];
  constructor(public getChampionsTable: GetChampionsTable) {
    this.getChampionsTable.returnScoreTable(this.table);
    document.body.oncontextmenu = function () {
      return false;
    };
  }
  newGame() {
    this.leftCells = this.columns * this.rows - this.maxMines;
    this.stackCells = [];
    this.timer = 0;
    this.result = 99999999999999;
    this.canSave = false;
    this.markedMines = 0;
    clearInterval(this.timeout);
    this.gameStarted = false;
    let leftCells = this.rows * this.columns;
    let leftMines = this.maxMines;
    for (let i = 0; i < this.rows; i++) {
      this.cells[i] = [];
      for (let j = 0; j < this.columns; j++) {
        this.cells[i][j] = Math.random() > this.rendCoefficient ? {
          mine: 0,
          closed: true,
          sum: 0,
          color: 'blue',
          marked: false,
          x: i,
          y: j
        } :
          {mine: 1, closed: true, sum: 0, color: 'blue', marked: false};
        leftCells--;
        if (this.cells[i][j].mine === 1) {
          leftMines--;
        }
        if (leftCells < leftMines && this.cells[i][j].mine === 0) {
          this.cells[i][j] = {mine: 1, closed: true, sum: 0, color: 'blue', marked: false, x: i, y: j};
          leftMines--;
        }
        if (leftMines === -1 && this.cells[i][j].mine === 1) {
          this.cells[i][j] = {mine: 0, closed: true, sum: 0, color: 'blue', marked: false, x: i, y: j};
          leftMines++;
        }
      }
    }
    let minesCreated = 0;
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.cells[i][j].sum = this.getSum(i, j);
        if (this.cells[i][j].mine === 1) {
          minesCreated++;
        }
      }
    }
  }
  getSum(i, j) {
    const sum = (((i > 0) && (j > 0)) ? this.cells[i - 1][j - 1].mine : 0)
    + ((i > 0) ? this.cells[i - 1][j].mine : 0)
    + (((i > 0) && (j < this.columns - 1)) ? this.cells[i - 1][j + 1].mine : 0)
    + ((j > 0) ? this.cells[i][j - 1].mine : 0)
    + ((j < this.columns - 1) ? this.cells[i][j + 1].mine : 0)
    + (((i < this.rows - 1) && (j > 0)) ? this.cells[i + 1][j - 1].mine : 0)
    + ((i < this.rows - 1) ? this.cells[i + 1][j].mine : 0)
    + (((i < this.rows - 1) && (j < this.columns - 1)) ? this.cells[i + 1][j + 1].mine : 0);
    if (sum === 0) {
      return '';
    } else {
      switch (sum) {
        case 1:
          this.cells[i][j].color = 'blue';
          break;
        case 2:
          this.cells[i][j].color = 'green';
          break;
        case 3:
          this.cells[i][j].color = 'red';
          break;
        case 4:
          this.cells[i][j].color = 'red';
          break;
        default:
          this.cells[i][j].color = 'darkred';
          break;
      }
      return sum;
    }
  }

  openMine(i, j) {
    const lastValue = this.cells[i][j].closed;
    this.cells[i][j].closed = false;
    this.counter(this.cells[i][j].closed, lastValue);
    if (!this.gameStarted) {
      this.gameStarted = true;
      this.timeout = setInterval(() => {
        if (this.gameStarted) {
          this.timer++;
        }
      }, 1000);
    }
    if (this.cells[i][j].mine === 1) {
      for (let k = 0; k < this.rows; k++) {
        for (let l = 0; l < this.columns; l++) {
          this.cells[k][l].closed = false;
        }
      }
      this.timer = 0;
      this.gameStarted = false;
      clearInterval(this.timeout);
    }
    if (this.cells[i][j].sum === '') {
      this.stackCells.push(this.cells[i][j]);
      this.openEnvironment(i, j);
    }
  }

  openEnvironment(i, j) {
    this.goThroughTheEnvironment(i, j, this.recurentAction);
  }

  private goThroughTheEnvironment(i, j, func) {
    if ((i > 0) && (j > 0)) {
      func(i - 1, j - 1, this);
    }
    if (i > 0) {
      func(i - 1, j, this);
    }
    if ((i > 0) && (j < this.columns - 1)) {
      func(i - 1, j + 1, this);
    }
    if (j > 0) {
      func(i, j - 1, this);
    }
    if (j < this.columns - 1) {
      func(i, j + 1, this);
    }
    if ((i < this.rows - 1) && (j > 0)) {
      func(i + 1, j - 1, this);
    }
    if (i < this.rows - 1) {
      func(i + 1, j, this);
    }
    if ((i < this.rows - 1) && (j < this.columns - 1)) {
      func(i + 1, j + 1, this);
    }
  }

  private recurentAction(i, j, context) {
    const lastValue = context.cells[i][j].closed;
    context.cells[i][j].closed = false;
    context.counter(context.cells[i][j].closed, lastValue);
    if (context.cells[i][j].sum === '') {
      if (context.notInStack(context.cells[i][j])) {
        context.stackCells.push(context.cells[i][j]);
        context.openEnvironment(i, j);
      }
    }
  }

  notInStack(cell) {
    let inStack = false;
    this.stackCells.forEach(elem => {
      if (elem.x === cell.x && elem.y === cell.y) {
        inStack = true;
      }
    });
    return !inStack;
  }

  openCells(i, j) {
    const minesSum = (((i > 0) && (j > 0)) ? this.cells[i - 1][j - 1].mine : 0)
    + ((i > 0) ? this.cells[i - 1][j].mine : 0)
    + (((i > 0) && (j < this.columns - 1)) ? this.cells[i - 1][j + 1].mine : 0)
    + ((j > 0) ? this.cells[i][j - 1].mine : 0)
    + ((j < this.columns - 1) ? this.cells[i][j + 1].mine : 0)
    + (((i < this.rows - 1) && (j > 0)) ? this.cells[i + 1][j - 1].mine : 0)
    + ((i < this.rows - 1) ? this.cells[i + 1][j].mine : 0)
    + (((i < this.rows - 1) && (j < this.columns - 1)) ? this.cells[i + 1][j + 1].mine : 0);
    const markedSum =  (((i > 0) && (j > 0) &&
    (this.cells[i - 1][j - 1].marked || (!this.cells[i - 1][j - 1].closed && this.cells[i - 1][j - 1].mine === 1))) ? 1 : 0)
    + ((i > 0 &&
    (this.cells[i - 1][j].marked || (!this.cells[i - 1][j].closed && this.cells[i - 1][j].mine === 1))) ? 1 : 0)
    + (((i > 0) && (j < this.columns - 1) &&
    (this.cells[i - 1][j + 1].marked || (!this.cells[i - 1][j + 1].closed && this.cells[i - 1][j + 1].mine === 1))) ? 1 : 0)
    + ((j > 0 &&
    (this.cells[i][j - 1].marked || (!this.cells[i][j - 1].closed && this.cells[i][j - 1].mine === 1))) ? 1 : 0)
    + ((j < this.columns - 1 &&
    (this.cells[i][j + 1].marked || (!this.cells[i][j + 1].closed && this.cells[i][j + 1].mine === 1))) ? 1 : 0)
    + (((i < this.rows - 1) && (j > 0) &&
    (this.cells[i + 1][j - 1].marked || (!this.cells[i + 1][j - 1].closed && this.cells[i + 1][j - 1].mine === 1))) ? 1 : 0)
    + ((i < this.rows - 1) &&
    (this.cells[i + 1][j].marked || (!this.cells[i + 1][j].closed && this.cells[i + 1][j].mine === 1)) ? 1 : 0)
    + (((i < this.rows - 1) && (j < this.columns - 1) &&
    (this.cells[i + 1][j + 1].marked || (!this.cells[i + 1][j + 1].closed && this.cells[i + 1][j + 1].mine === 1))) ? 1 : 0);
    if (markedSum === minesSum) {
      this.goThroughTheEnvironment(i, j, this.openCellEnviroment);
    }
  }
  private openCellEnviroment(i, j, context) {
    const lastValue = context.cells[i][j].closed;
    context.cells[i][j].closed = context.cells[i][j].mine === 1 ? true : false;
    if (!context.cells[i][j].closed && context.cells[i][j].sum === '') {
      context.openEnvironment(i, j);
    }
    context.counter(context.cells[i][j].closed, lastValue);
  }
  paramsChanged() {
    this.rendCoefficient = this.maxMines / (this.rows * this.columns);
    this.cells = [];
    this.gameStarted = false;
  }
  saveResults(table) {
    this.getChampionsTable.dataSource.push(
      {
        game: '' + this.columns + 'x' + this.rows + 'x' + this.maxMines,
        name: this.player,
        score: this.result
      }
    );
    this.getChampionsTable.dataSource.sort((a, b) => {
      if (a !== null && b !== null) {
        if (a.score > b.score) {
          return 1;
        } else {
          return -1;
        }
      } else {
        return 0;
      }
    });
    this.getChampionsTable.saveScoreTable(table);
    this.getChampionsTable.returnScoreTable(table);
    table.renderRows();
    this.canSave = false;
  }
  counter(closed, lastValue) {
    if (closed !== lastValue) {
      if (!closed) {
        this.leftCells--;
        if (this.leftCells === 0) {
          this.result = this.timer;
          clearInterval(this.timeout);
          this.timer = this.result;
          alert('You win with result: ' + this.result + '. You can save it.');
          this.canSave = true;
        }
      }
    }
  }
  markMine(i, j) {
    this.cells[i][j].marked = !this.cells[i][j].marked;
    if (this.cells[i][j].marked) {
      this.markedMines++;
    } else {
      this.markedMines--;
    }
  }
}

