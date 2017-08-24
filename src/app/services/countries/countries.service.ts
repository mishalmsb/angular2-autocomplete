import { Injectable }         from '@angular/core';
import { Country, countries } from "./countries.model";
import { Observable }         from "rxjs/Rx";

@Injectable()
export class CountriesService {

    getCountries() : Observable<Country[]> {
        return Observable.of(countries);
    }
}