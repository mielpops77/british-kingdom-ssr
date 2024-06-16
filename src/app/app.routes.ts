import { Routes } from '@angular/router';
import { AccueilComponent } from './accueil/accueil.component';
import { ChatonsComponent } from './chatons/chatons.component';
import { FemellesComponent } from './femelles/femelles.component';
import { MalesComponent } from './/males/males.component';
import { ConditionsComponent } from './conditions/conditions.component';
import { ContactComponent } from './contact/contact.component';
import { LivreDorComponent } from './livre-dor/livre-dor.component';
import { PolitiqueConfidentialiteComponent } from './mentions-légales/politique-confidentialite/politique-confidentialite.component';
import { MentionsLegalesComponent } from './mentions-légales/mentions-legales/mentions-legales.component';

export const routes: Routes = [

    { path: '', component: AccueilComponent },

    { path: 'chatons', component: ChatonsComponent, data: { preload: true } },
    { path: 'femelles', component: FemellesComponent, data: { preload: true } },
    { path: 'males', component: MalesComponent, data: { preload: true } },
    { path: 'conditions', component: ConditionsComponent, data: { preload: true } },
    { path: 'contact', component: ContactComponent, data: { preload: true } },
    { path: 'livre-dor', component: LivreDorComponent, data: { preload: true } },
    { path: 'politique-confidentialite', component: PolitiqueConfidentialiteComponent, data: { preload: true } },
    { path: 'mentions-legales', component: MentionsLegalesComponent, data: { preload: true } },

    { path: 'males/:id', loadComponent: () => import('./cat/cat.component').then(m => m.CatComponent) },
    { path: 'portee/:id', loadComponent: () => import('./chatons/portees/portees.component').then(m => m.PorteesComponent) },
    { path: 'femelles/:id', loadComponent: () => import('./cat/cat.component').then(m => m.CatComponent) },

    { path: '**', loadComponent: () => import('./page-not-found/page-not-found.component').then(m => m.PageNotFoundComponent) }
];