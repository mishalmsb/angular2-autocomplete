import { htmlTemplate } from './autocomplete.component.html';
import { Component }    from '@angular/core';

@Component({
    selector: 'autocomplete-component',
    template: htmlTemplate
})

export class AutocompleteComponent {

    constructor() {
    }

    public ngOnInit() {
        console.log('init');
    }
}