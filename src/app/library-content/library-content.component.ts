import {Component, Input, OnInit} from '@angular/core';
import {LibraryLetter} from "../interfaces/library";
import {NotificationService} from "../utils/notification.service";

@Component({
  selector: 'app-library-content',
  templateUrl: './library-content.component.html',
  styleUrls: ['./library-content.component.css']
})
export class LibraryContentComponent{

  constructor(private notificationService: NotificationService) {
  }
  private index: number = 0;
  private latinRegex = /^[a-zA-Z]$/;
  private cyrillicRegex = /^[а-яА-Я]$/;

  @Input("content")
  content: LibraryLetter[];

  slavicContent: LibraryLetter[];
  latinContent: LibraryLetter[];
  otherContent: LibraryLetter[];

  ngOnInit(): void {
    setInterval(() => {
      this.notificationService.showNotification(
          `Track ${this.index++} were not added to library.`, "error", 5000);
    }, 2000)
  }

  ngOnChanges(): void {
    this.slavicContent = this.content?.filter(libraryLetter => this.cyrillicRegex.test(libraryLetter.letter));
    this.latinContent = this.content?.filter(libraryLetter => this.latinRegex.test(libraryLetter.letter));
    this.otherContent = this.content?.filter(libraryLetter =>
        !this.latinRegex.test(libraryLetter.letter) && !this.cyrillicRegex.test(libraryLetter.letter)
    );
  }

}
