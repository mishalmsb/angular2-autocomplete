import { NgModule }               from '@angular/core';
import { CommonModule }           from '@angular/common';
import { FormsModule }            from '@angular/forms';
import { AutocompleteComponent }  from './autocomplete.component';

@NgModule({
    imports      : [ CommonModule, FormsModule ],
    declarations : [ AutocompleteComponent ],
    providers    : [],
    exports      : [ AutocompleteComponent ]
})

export class AutocompleteModule {}