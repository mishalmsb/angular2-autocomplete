import { BrowserModule }      from '@angular/platform-browser';
import { NgModule }           from '@angular/core';
import { FormsModule }        from '@angular/forms';
import { AppComponent }       from './app.component';
import { AutocompleteModule } from './components/autocomplete';
import { CountriesService }   from './services';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        AutocompleteModule
    ],
    providers: [
        CountriesService
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule { }
