import { Injectable } from '@angular/core';
import { ThemeService } from './themes/theme.service';
import { ProfilService } from './profil/profil.service';
import { PorteesService } from './Portees/portees.service';
import { CatsService } from './cats/cats.service';
import { ChatonsService } from './chatons/chatons.service';

@Injectable({
  providedIn: 'root'
})
export class InitializationService {

  constructor(
    private themeService: ThemeService,
    private profilService: ProfilService,
    private porteesService: PorteesService,
    private catsService: CatsService,
    private ChatonsService: ChatonsService
  ) { }



  initialize(): Promise<any> {
    return Promise.all([
      this.themeService.loadTemplate1(),
      this.profilService.loadProfil(),
      this.catsService.loadCats(),
      this.porteesService.loadPortee(),
      this.ChatonsService.loadChaton()
    ]);
  }
}
