export const htmlTemplate = `
<section>
    <input  type="text" name="vastari-autocomplete-selector" id="vastari-autocomplete-selector"
            #vastariAutocompleteSelector="ngModel"
            [placeholder]="placeholder"
            [(ngModel)]="query"
            (keydown)=onKeydown($event)
            (keyup)=onKeyup($event)
            (blur)=onBlur()
            (focus)="onFocus()"
            (ngModelChange)="onNgModelChange()"
            [required]="isRequired"
            [disabled]="isInputDisabled">
    <label class="active">{{label}}</label>
    <div class="input-error" *ngIf="vastariAutocompleteSelector.dirty && eustonWeHaveAProblem?.invalid && showError && !showFilteredList && !query">
        {{errorMsg}}
    </div>
    <div class="autocomplete-content-wrapper">
    <ul class="autocomplete-content dropdown-content" *ngIf="showFilteredList">
        <li *ngIf="query?.length < minLengthSearch">
            <a *ngIf="query?.length < minLengthSearch && query?.length == 0">Start typing ...</a>
            <a *ngIf="query?.length + 1 <= minLengthSearch && query?.length > 0">Keep typing ...</a>
            <a *ngIf="!isLoadingData && query?.length > minLengthSearch">Loading ...</a>
        </li>
        <li *ngIf="!isLoadingData && query?.length >= minLengthSearch && filteredList.length == 0">
            <a>No results for: {{query}}</a>
        </li>
        <section *ngIf="query?.length >= minLengthSearch">
            <li [class.active]="i == selectedIdx" *ngFor="let item of filteredList; let i = index">
                <a (mousedown)="selectItem(item)"  [innerHTML]="highlightedQuery(item)"></a>
            </li>
        </section>
    </ul>
    </div>
</section>
`