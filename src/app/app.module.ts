import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {FormsModule} from '@angular/forms';
import {MatFormFieldModule, MatInputModule, MatTableModule} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {GetChampionsTable} from './app.service';
import {HttpModule} from '@angular/http';
import {IncludeStrPipe} from './game-filter.pipe';

@NgModule({
  declarations: [
    AppComponent,
    IncludeStrPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    BrowserAnimationsModule,
    MatTableModule,
    HttpModule
  ],
  providers: [GetChampionsTable],
  bootstrap: [AppComponent]
})
export class AppModule { }
