import { Component, OnInit, Input } from '@angular/core';

@Component({
   selector: 'app-playback-view',
   templateUrl: './playback-view.component.html',
   styleUrls: ['./playback-view.component.scss']
})
export class PlaybackViewComponent implements OnInit {
   @Input() context: string;
   @Input() message: string;
   orientation: string;

   constructor() {
      window.addEventListener('resize', this.updateOrientation.bind(this));
      this.updateOrientation();
   }

   updateOrientation() {
      if (window.innerWidth >= window.innerHeight) {
         this.orientation = 'Landscape';
         return;
      }

      this.orientation = 'Portrait';
   }

   ngOnInit() {
      console.log('Playback View Init');
   }
}
