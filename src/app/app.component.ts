import { Component }                 from '@angular/core';
import { CountriesService, Country } from './services/countries';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {

    title : string = 'Angular2 autocomplete';
    countries : Country[];
    countrCode : string;

    constructor(private _countryService : CountriesService) {}

    ngOnInit() {
        this.getCountries();
    }

    getCountries() {
        this._countryService.getCountries().subscribe((countries: Country[]) => {
            this.countries = countries;
        })
    }

    onChange() {
        console.log(this.countrCode);
    }
}
