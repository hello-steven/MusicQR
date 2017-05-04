import { Component } from '@angular/core';

import { HomePage } from '../home/home';
import { ScanPage } from '../scan/scan';
import { LibraryPage } from '../library/library';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = HomePage;
  tab2Root: any = ScanPage;
  tab3Root: any = LibraryPage;

  constructor() {

  }
}
