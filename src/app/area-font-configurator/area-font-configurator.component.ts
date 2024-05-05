import {Component, EventEmitter, Input, Output} from '@angular/core';
import {BackgroundRectangle} from "../interfaces/blank/background";

@Component({
  selector: 'app-area-font-configurator',
  templateUrl: './area-font-configurator.component.html',
  styleUrls: ['./area-font-configurator.component.scss', './../common-styles/scrollbar.css']
})
export class AreaFontConfiguratorComponent {
  @Input()
  backgroundArea: BackgroundRectangle;

  @Output() fontChanged: EventEmitter<BackgroundRectangle> = new EventEmitter<BackgroundRectangle>();

  selectedFont: string = 'Arial';
  selectedFontSize: number = 16;
  availableFonts: string[] = ['Arial', 'Helvetica', 'Times New Roman', 'Verdana', 'Courier New', 'Roboto'];
  availableFontSizes: number[] = [12, 14, 16, 18, 20, 24, 28, 32];

}
