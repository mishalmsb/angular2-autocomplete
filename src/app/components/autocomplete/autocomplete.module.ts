import { NgModule }               from '@angular/core';
import { CommonModule }           from '@angular/common';
import { FormsModule }            from '@angular/forms';
import { HttpModule }             from '@angular/http';
import { AutocompleteComponent }  from './autocomplete.component';

@NgModule({
    imports      : [ CommonModule, FormsModule, HttpModule ],
    declarations : [ AutocompleteComponent ],
    providers    : [],
    exports      : [ AutocompleteComponent ]
})

export class AutocompleteModule {}