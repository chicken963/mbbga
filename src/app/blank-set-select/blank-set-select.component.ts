import {Component, Inject, Input} from '@angular/core';
import {Game} from "../interfaces/game";
import {GameBlankSet} from "../interfaces/blank/game-blank-set";
import {HttpClient} from "@angular/common/http";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Router} from "@angular/router";

@Component({
    selector: 'app-blank-set-select',
    templateUrl: './blank-set-select.component.html',
    styleUrls: ['./blank-set-select.component.css']
})
export class BlankSetSelectComponent {

    blankSets: GameBlankSet[];
    selectedBlankSet: GameBlankSet;
    gameId: string;

    constructor(@Inject(MAT_DIALOG_DATA) public data: any,
                private router: Router,
                private dialogRef: MatDialogRef<BlankSetSelectComponent>,
                private http: HttpClient) {
        this.gameId = data.gameId;
    }


    ngOnInit() {
        this.http.get<GameBlankSet[]>(`/blanks?game-id=${this.gameId}`).subscribe(response => {
            this.blankSets = response;
        })
    }

    cancel() {
        this.dialogRef.close();
    }

    startGame() {
        this.dialogRef.close();
        this.router.navigate(['game', this.gameId ,'play', this.selectedBlankSet.id]);
    }
}
