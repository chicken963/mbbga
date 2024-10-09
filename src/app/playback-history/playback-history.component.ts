import {Component, Inject, OnInit} from '@angular/core';
import {GamePlay} from "../interfaces/gameplay/game-play";
import {HttpClient} from "@angular/common/http";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MatTableDataSource} from "@angular/material/table";

@Component({
    selector: 'app-playback-history',
    templateUrl: './playback-history.component.html',
    styleUrls: ['./playback-history.component.scss']
})
export class PlaybackHistoryComponent implements OnInit {
    gamePlays: GamePlay[];
    dataSource: MatTableDataSource<GamePlay>;
    displayedColumns: string[] = ['position', 'startedAt', 'status', 'author', 'remove'];
    gamePlaysArePreloaded: boolean = false;

    constructor(@Inject(MAT_DIALOG_DATA) public data: any,
                private dialogRef: MatDialogRef<PlaybackHistoryComponent>,
                private http: HttpClient) {
    }

    ngOnInit(): void {
        this.gamePlaysArePreloaded = true;
        this.http.get<GamePlay[]>(`/gameplay?game-id=${this.data.gameId}`).subscribe(response => {
            this.gamePlaysArePreloaded = false;
            this.gamePlays = response;
            this.dataSource = new MatTableDataSource(this.gamePlays);
        })
    }

    getStatus(gamePlay: GamePlay): string {
        if (gamePlay.roundPlays.find(rp => rp.status === "in progress")) {
            return "in progress";
        }
        if (gamePlay.roundPlays.every(rp => rp.status === "finished")) {
            return "finished";
        }
        return "not started";

    }

    removeFromTable(gamePlay: GamePlay) {
        this.http.delete(`/gameplay?id=${gamePlay.id}`).subscribe(response => {

            let index = this.gamePlays.indexOf(gamePlay);
            if (index !== -1) {
                this.gamePlays.splice(index, 1);
            }
            this.refresh();
        })
    };

    refresh() {
        this.dataSource.data = this.gamePlays;
    }

    closePopup() {
        this.dialogRef.close();
    }
}
