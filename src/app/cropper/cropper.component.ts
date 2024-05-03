import {Component, ElementRef, EventEmitter, Inject, Output, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {BackgroundService} from "../services/background.service";
import {BackgroundRectangle, BlankBackground} from "../interfaces/blank/background";
import {AreaType} from "../blank/AreaType";
import {TransformedAreaComponent} from "../transformed-area/transformed-area.component";
import {HttpClient} from "@angular/common/http";
import {DatePipe} from "../date.pipe";
import {AuthService} from "../services/auth.service";
import {NotificationService} from "../utils/notification.service";
import {DialogService} from "../utils/dialog.service";

@Component({
    selector: 'app-cropper',
    templateUrl: './cropper.component.html',
    styleUrls: ['./cropper.component.scss']
})
export class CropperComponent {

    @ViewChild("bgImage")
    bgImage: ElementRef;

    @ViewChildren(TransformedAreaComponent)
    transformAreas: QueryList<TransformedAreaComponent>;

    datePipe = new DatePipe();
    selectedArea: BackgroundRectangle;
    croppedImage: any = '';
    areaTypes: AreaType[] = Object.values(AreaType);
    currentType: AreaType;
    currentArea: BackgroundRectangle;
    imageRect: any;
    areaStyles: Map<BackgroundRectangle, any> = new Map<BackgroundRectangle, any>();
    areaRectangles: Map<BackgroundRectangle, TransformedAreaComponent> = new Map<BackgroundRectangle, TransformedAreaComponent>();
    background: BlankBackground;
    mode: "create" | "edit";

    constructor(@Inject(MAT_DIALOG_DATA) public data: any,
                private dialogRef: MatDialogRef<CropperComponent>,
                private http: HttpClient,
                private authService: AuthService,
                private notificationService: NotificationService,
                private dialogService: DialogService,
                private backgroundService: BackgroundService) {
        this.background = data.background;

        this.background.areas.forEach(area => {
            this.areaStyles.set(area, {
                'width': `${area.width}px`,
                'height': `${area.height}px`,
                'top': `${area.startY}px`,
                'left': `${area.startX}px`
            })
        });
        this.currentArea = this.background.areas[0];
        this.currentType = this.currentArea.backgroundAreaType;

        if (data.src) {
            this.background.image = data.src;
        }
        this.mode = data.src ? "create" : "edit";
    }

    ngOnInit() {
        // window.addEventListener('keydown', (event) => this.move(event));
    }

    ngOnDestroy() {
        // window.removeEventListener('keydown', (event) => this.move(event));
    }

    ngAfterViewInit() {
        this.transformAreas.forEach(transformArea => this.areaRectangles.set(transformArea.area, transformArea));
    }

/*    move(event: KeyboardEvent) {
        let index = this.background.areas.indexOf(this.selectedArea);
        if (index >= 0) {
            this.transformAreas.get(index)?.move(event);
        }
    }*/

    setSelectedArea(area: BackgroundRectangle) {
        this.selectedArea = area;
        this.areaStyles.get(area)['background-color'] = 'rgba(0, 255, 0, 0.2)'
    }

    saveBackground() {
        if (this.mode === 'create') {
            this.http.post<BlankBackground>("/backgrounds", this.background).subscribe(response => {
                this.notificationService.pushNotification(`Background "${response.name}" successfully saved`);
                this.backgroundService.setBackgroundAdded(response);
            });
        } else {
            this.http.put<BlankBackground>("/backgrounds", this.background).subscribe(response => {
                this.notificationService.pushNotification(`Background "${response.name}" successfully updated`);
            });
        }

        this.dialogRef.close();
    }

    openConfirmationDialog() {
        this.dialogService.openYesNoPopup("Are you sure you want to cancel editing bounds?",
            (confirmed: boolean) => {
                if (confirmed) {
                    this.dialogRef.close();
                }
            });
    }

    moveRectangle(area: BackgroundRectangle, $event: BackgroundRectangle) {
        this.areaStyles.set(area, {
            'width': `${$event.width}px`,
            'height': `${$event.height}px`,
            'top': `${$event.startY}px`,
            'left': `${$event.startX}px`
        })
    }

    justifySampleTextInRectangle(area: BackgroundRectangle) {
        setTimeout(() => {
            this.areaRectangles.get(area)?.justifySampleTextCenter()
        }, 0);

    }
}
