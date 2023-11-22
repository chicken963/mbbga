import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import {WelcomeComponent} from "./welcome/welcome.component";
import {LoginComponent} from "./login/login.component";
import {PlayerComponent} from "./pages/player/player.component";
import {LibraryComponent} from "./library/library.component";

const routes: Routes = [
  { path: "", component: WelcomeComponent },
  { path: "login", component: LoginComponent},
  { path: "player", component: PlayerComponent},
  { path: "audio-library", component: LibraryComponent},
  { path: "**", redirectTo: "" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}