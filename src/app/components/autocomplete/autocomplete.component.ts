import { htmlTemplate }                                       from './autocomplete.component.html';
import { Component, ElementRef, Input, ViewEncapsulation,
         forwardRef, ViewChild, Output, EventEmitter}         from '@angular/core';
import { NG_VALIDATORS, NgModel, NgForm, AbstractControl,
         Validator, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Http, Response, Headers, RequestOptions }            from "@angular/http";
import 'rxjs/add/operator/toPromise';

@Component({
    selector: 'autocomplete-component',
    template: htmlTemplate,
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => AutocompleteComponent), multi: true },
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => AutocompleteComponent), multi: true}
    ],
    styles: [`
        .autocomplete-content-wrapper {
            position: absolute;
            width: 100%;
            z-index: 99999;
            padding: 0 0.75rem;
            left: 0;
        }
    `],
    encapsulation: ViewEncapsulation.None
})

export class AutocompleteComponent implements ControlValueAccessor, Validator {

    @Input('label') label                               : string  = 'Autocomplete';
    @Input('show-error') showError                      : boolean = true;
    @Input('is-required') isRequired                    : boolean = true;
    @Input('error-msg') errorMsg                        : string  = 'Required';
    @Input('placeholder') placeholder                   : string  = "";
    @Input('api-url') apiUrl                            : string  = "";
    @Input('autocomplete-data') autocompleteData        : Array<any>;
    @Input('display-key') displayKey                    : string  = 'name';
    @Input('secondary-display-key') secondaryDisplayKey : string;
    @Input('return-key') returnKey                      : string  = 'code';
    @Input('results-limit') resultsLimit                : number  = 5;
    @Input('min-length-search') minLengthSearch         : number  = 0;
    public returnValue                                  : any;
    @Input() get query() {
        return this.queryValue;
    }
    set query(val) {
        this.queryValue                                 = val;
        this.queryChange.emit(this.queryValue);
    }
    @Output() queryChange                               = new EventEmitter();
    queryValue                                          : string;
    @Input('is-input-disabled') get isInputDisabled() {
        return this.isInputDisabledValue;
    }
    set isInputDisabled(val) {
        this.isInputDisabledValue                       = val;
        this.isInputDisabledChange.emit(this.isInputDisabledValue);
    }
    @Output() isInputDisabledChange                     = new EventEmitter();
    isInputDisabledValue                                : boolean;
    public filteredList                                 : Array<any> = new Array<any>();
    public selectedIdx                                  : number  = -1;
    public eustonWeHaveAProblem                         : any;
    public isDisabled                                   : boolean = true;
    public numberOfFilteredData                         : number;
    public showFilteredList                             : boolean = false;
    public isLoadingData                                : boolean = true;

    constructor(private _http : Http) {
    }

    public ngOnInit() {
        this.query = '';
        if (this.apiUrl && this.minLengthSearch == 0) {
            this.getRemoteData();
        }
    }

    onKeyup(e: any) {
        if (e.which === 13 || e.which === 38 || e.which === 40 || e.keyCode === 13 || e.keyCode === 38 || e.keyCode === 40) {
            return;
        }
        if (this.apiUrl) {
            this.getRemoteData();
        } else {
            this.setFilteredList();
        }
    }

    onKeydown(e: any) {
        if ((e.keyCode == 40 || e.which == 40 ) && this.selectedIdx < this.filteredList.length - 1) {
            e.preventDefault();
            if (this.selectedIdx < this.numberOfFilteredData -1) {
                this.selectedIdx++;
            }
        } else if ((e.keyCode == 38 || e.which == 38 ) && this.selectedIdx > 0) {
            e.preventDefault();
            this.selectedIdx--;
        }
        if ((e.keyCode == 13 || e.which == 13 ) && this.selectedIdx >= 0) {
            e.preventDefault();
            this.query = this.filteredList[this.selectedIdx][this.displayKey];
            this.selectItem(this.filteredList[this.selectedIdx]);
            this.filteredList = [];
        }
    }

    onNgModelChange() {
        this.setReturnValueNull();
    }

    onFocus() {
        this.showFilteredList = true;
        this.query = '';
        this.setReturnValueNull();
        if (this.minLengthSearch == 0) {
            this._showFilteredList();
        }
    }

    private _showFilteredList() {
        if (this.apiUrl) {
            this.getRemoteData();
        } else {
            this.setFilteredList();
        }
    }

    setfilteredListByResultsLimit(data : Array<any>) {
        // let resultLimitData = _.slice(data, 0, this.resultsLimit);
        return data.slice(0, this.resultsLimit);
    }

    setFilteredList() {
        let self = this;
        if (this.query !== "" && this.query.length >= this.minLengthSearch) {
            let data = this.autocompleteData.filter(function (el) {
                return el[self.displayKey].toLowerCase().indexOf(self.query.toLowerCase()) > -1;
            });
            this.filteredList = this.setfilteredListByResultsLimit(data);
        } else {
            this.filteredList = this.setfilteredListByResultsLimit(this.autocompleteData);
        }
        this.showFilteredList = true;
        this.isLoadingData = false;
        this.numberOfFilteredData = this.filteredList.length;
        this.selectedIdx = -1;
    }

    highlightedQuery(item : any) {
        let selectedItem = item[this.displayKey],
            matchStart = selectedItem.toLowerCase().indexOf("" + this.query.toLowerCase() + ""),
            matchEnd = matchStart + this.query.length - 1,
            beforeMatch = selectedItem.slice(0, matchStart),
            matchText = selectedItem.slice(matchStart, matchEnd + 1),
            afterMatch = selectedItem.slice(matchEnd + 1),
            secondaryDisplayText = (this.secondaryDisplayKey) ? ` <span>(${item[this.secondaryDisplayKey]})</span>` : '';
        if (matchText) {
            return `<span>${beforeMatch}</span><span class='highlight'>${matchText}</span><span>${afterMatch}</span>${secondaryDisplayText}`
        }
        return `<span>${selectedItem}</span>${secondaryDisplayText}`;
    };

    onBlur() {
        this.filteredList = [];
        this.showFilteredList = false;
        if (!this.returnValue) {
            this.query = '';
        }
    }

    selectItem(item : any) {
        this.returnValue = item[this.returnKey];
        this.query = item[this.displayKey];
        this.filteredList = [];
        this.showFilteredList = false;
        this.propageteChanges();
    }

    public validate(c: AbstractControl) {
        this.eustonWeHaveAProblem = this.getValidation();
        return this.eustonWeHaveAProblem;
    }

    getValidation() {
        if (!this.returnValue && this.isRequired) {
            return {invalid : this.errorMsg}
        }
        return null;
    }

    async getRemoteData(body: string = ""): Promise<any> {
        this.isLoadingData = true;
        if (this.query.length >= this.minLengthSearch) {
            let options = this.getRequestOptions(body);
            let url = this.apiUrl.replace(":searchKey", this.query);
            const response = await this._http.get(url, options).toPromise();
            this.autocompleteData = response.json();
            this.setFilteredList();
        }
    }

    public getRequestOptions(body:string) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json' );
        let requestOptions = new RequestOptions({ body: body, headers: headers });
        return requestOptions;
    }

    setReturnValueNull() {
        this.returnValue = null;
        this.propageteChanges();
    }

    propageteChanges() {
        this.propagateChange(this.returnValue);
    }

    writeValue(value: any) {
        if (value != undefined && value != null ) {
            this.returnValue = value;
        }
    }

    registerOnChange(fn : any) {
        this.propagateChange = fn;
    }

    registerOnTouched() {}

    private propagateChange = (_: any) => { };
}