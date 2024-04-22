import { Component, OnInit } from '@angular/core';
import { CardApiService } from 'src/app/services/card-api-service/card-api.service';

@Component({
   selector: 'app-base-view',
   templateUrl: './base-view.component.html',
   styleUrls: ['./base-view.component.scss']
})
export class BaseViewComponent implements OnInit {
   model: {};
   context: string;
   message: string;
   contexts: {};

   constructor(private cardApiService: CardApiService) {
      this.cardApiService = cardApiService;
      this.cardApiService.setBroadcastCallback(this.handleBroadcast.bind(this));
      this.getCurrentView();
      this.contexts = this.cardApiService.PLAYBACKCONTEXT;
   }

   getCurrentView() {
      this.context = this.cardApiService.getPlaybackContext();
   }

   handleBroadcast(event, data) {
      switch (event) {
         case 'cardapi.model-update':
            this.onModelUpdate();
            break;
         default:
            console.log(event, data);
      }
   }

   extractMessage() {
      this.message = this.cardApiService.getModelProperty('title').value;
   }

   onModelUpdate() {
      console.log('model updated');
      this.model = this.cardApiService.getModel();
      this.extractMessage();
   }

   getCurrentViewContext() {
      return this.cardApiService.getPlaybackContext();
   }

   ngOnInit() {
      console.log(this.cardApiService);
      this.cardApiService.onModelUpdate = this.onModelUpdate;
      console.log('Base View Init');
   }
}
