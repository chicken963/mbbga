import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import {LoginComponent} from "./login/login.component";
import {PlayerComponent} from "./pages/player/player.component";
import {LibraryComponent} from "./library/library.component";
import {RegistrationComponent} from "./registration/registration.component";
import {UsersDashboardComponent} from "./users-dashboard/users-dashboard.component";
import {GamesDashboardComponent} from "./games-dashboard/games-dashboard.component";
import {CreateGameComponent} from "./create-game/create-game.component";

const routes: Routes = [
  { path: "login", component: LoginComponent},
  { path: "registration", component: RegistrationComponent},
  { path: "player", component: PlayerComponent},
  { path: "audio-library", component: LibraryComponent},
  { path: "game-dashboard", component: GamesDashboardComponent},
  { path: "user-dashboard", component: UsersDashboardComponent},
  { path: "game/new", component: CreateGameComponent},
  { path: 'game/:id', component: CreateGameComponent},
  { path: "**", redirectTo: "" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}