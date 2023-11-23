import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeFormatPipe } from '../time-format.pipe';



@NgModule({
    declarations: [
        TimeFormatPipe
    ],
    exports: [
        TimeFormatPipe
    ],
    imports: [
        CommonModule
    ]
})
export class TimeFormatModule { }
