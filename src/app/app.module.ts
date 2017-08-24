import { BrowserModule }      from '@angular/platform-browser';
import { NgModule }           from '@angular/core';
import { AppComponent }       from './app.component';
import { AutocompleteModule } from './components/autocomplete';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AutocompleteModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
