import { ThemeService } from '../services/themes/theme.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgStyle } from '@angular/common';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [NgStyle],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent implements OnInit, OnDestroy {


  private templateSubscription: Subscription | undefined;
  private colorFooter: string | undefined = "";

  constructor(private themeService: ThemeService) {

  }

  ngOnInit(): void {
    this.templateSubscription = this.themeService.template1$.subscribe(
      (response) => {
        this.colorFooter = response?.colorFooter;
      }
    )
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

  }


  public getDynamicStyles(): any {
    const styles: any = {};
    styles['background-color'] = this.colorFooter;
    return styles;
  }


  ngOnDestroy(): void {
    this.templateSubscription?.unsubscribe();
  }
}
