import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import {WelcomeComponent} from "./welcome/welcome.component";
import {LoginComponent} from "./login/login.component";
import {PlayerComponent} from "./pages/player/player.component";

const routes: Routes = [
  { path: "", component: WelcomeComponent },
  { path: "login", component: LoginComponent},
  { path: "player", component: PlayerComponent},
  { path: "**", redirectTo: "" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}