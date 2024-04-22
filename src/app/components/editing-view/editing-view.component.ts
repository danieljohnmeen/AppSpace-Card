import { Component, OnInit, Input } from '@angular/core';

@Component({
   selector: 'app-editing-view',
   templateUrl: './editing-view.component.html',
   styleUrls: ['./editing-view.component.scss']
})
export class EditingViewComponent implements OnInit {
   @Input() message: string;
   context: string;

   constructor() {
      this.context = 'Editing';
   }

   ngOnInit() {
      console.log('Editing View Init');
   }
}
