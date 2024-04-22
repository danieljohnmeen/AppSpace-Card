import { Component, OnInit, Input } from '@angular/core';

@Component({
   selector: 'app-screenshot-view',
   templateUrl: './screenshot-view.component.html',
   styleUrls: ['./screenshot-view.component.scss']
})
export class ScreenshotViewComponent implements OnInit {
   @Input() message: string;
   context: string;

   constructor() {
      this.context = 'Screenshot';
   }

   ngOnInit() {
      console.log('Editing View Init');
   }
}
