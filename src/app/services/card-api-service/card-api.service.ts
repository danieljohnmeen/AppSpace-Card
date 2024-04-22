import { Injectable } from '@angular/core';

declare global {
   interface Window {
      $cardApi: any;
   }
}

const $cardApi = window.$cardApi;
const noop: any = () => {};

@Injectable({
   providedIn: 'root'
})
export class CardApiService {
   model: any;
   schema: any;
   isEditing: boolean;
   mode: string;
   PLAYBACKCONTEXT: {};
   broadcast: any;

   constructor() {
      this.model = {};
      this.schema = {};
      this.mode = 'tv';
      this.isEditing = $cardApi.isEditing();
      this.PLAYBACKCONTEXT = $cardApi.PLAYBACKCONTEXT;
      this.broadcast = noop;

      // Subscribe to model and display mode update events
      $cardApi.subscribeModelUpdate(this.onModelUpdate.bind(this));
      $cardApi.subscribeModeChange(this.onModeUpdate.bind(this));
      $cardApi.subscribeToMessages(this.onMessage.bind(this));

      $cardApi.init();
   }

   /**
    * Lets the host know that we have loaded all resources in the template.
    */
   notifyLoaded(): void {
      $cardApi.notifyOnLoad();
      console.debug('notifyOnLoad called.  Card is ready.');
   }

   /**
    * Lets the host know that we have loaded all resources in the template.
    */
   notifyComplete(): void {
      $cardApi.notifyOnComplete();
      console.debug('notifyOnComplete called.  Card is complete.');
   }

   /**
    * Lets the host know that error occurs.
    */
   notifyOnError(): void {
      $cardApi.notifyOnError();
      console.debug('notifyOnError called. Card is error.');
   }

   setBroadcastCallback(callback): void {
      if (!callback || typeof callback !== 'function') {
         return;
      }

      this.broadcast = callback;
   }

   // Returns the playback context; editing, device, screenshot, none
   getPlaybackContext(): any {
      return $cardApi.getPlaybackContext();
   }

   updateInputModel(input): void {
      $cardApi.api.updateModelInput(input);
   }

   updateCustomData(customData): void {
      $cardApi.api.updateModelCustomData(customData);
   }

   getModelProperty(name): any {
      return $cardApi.getModelProperty(name);
   }

   getModel(): any {
      return Object.assign({}, this.model);
   }

   getMode(): any {
      return this.mode;
   }

   getConfig(): any {
      return Object.assign({}, $cardApi.getConfig());
   }

   getSchema(): any {
      return Object.assign({}, this.schema);
   }

   getSchemaInput(name): any {
      name = name.toLowerCase();
      if (this.schema.inputs && this.schema.inputs.length > 0) {
         for (let i = 0; i < this.schema.inputs.length; i++) {
            const input = this.schema.inputs[i];
            if (input.name.toLowerCase() === name) {
               return input;
            }
         }
      }
      return null;
   }

   getCustomData(): any {
      return Object.assign({}, this.model.customData);
   }

   // Custom method to append to CustomData instead of replacing it
   // Accepts Objects with (dot) separated keys representing the path in
   // The custom data, leaves all the other properties in the custom data intact
   // For Example if you pass:
   // {
   //      "card.data.id" : 1,
   //      "card.another": "abc"
   // }
   // Translates to {card : {data : {id : 1}}, another: "abc"} in the custom data
   // Will create all missing properties along its path including the base custom data object
   appendCustomData(data): void {
      if (!data) {
         return;
      }
      const currentCustomData = this.getCustomData() || {};
      for (const path in data) {
         const value = data[path];

         const pathParts = path.split('.');

         if (pathParts.length === 1) {
            currentCustomData[pathParts[0]] = value;
         } else {
            let currentPath = currentCustomData;
            for (let i = 0; i < pathParts.length; i++) {
               if (i === pathParts.length - 1) {
                  currentPath[pathParts[i]] = value;
                  break;
               }
               if (!currentPath[pathParts[i]] || !(currentPath[pathParts[i]] instanceof Object)) {
                  currentPath[pathParts[i]] = {};
               }
               currentPath = currentPath[pathParts[i]];
            }
         }
      }

      this.updateCustomData(currentCustomData);
   }

   // Returns a value from the custom data using (dot) separated paths
   // For Example: card.data.id represents {card : {data : {id : returnValue }}}
   // Gracefully returns undefined if the path is wrong
   readCustomDataPath(path: string): any {
      if (!path) {
         return this.getCustomData();
      }
      // Ignore starting '.'
      if (path.startsWith('.')) {
         return this.readCustomDataPath(path.substr(1));
      }
      // Ignore ending '.'
      if (path.endsWith('.')) {
         return this.readCustomDataPath(path.substr(0, path.length - 1));
      }
      const currentCustomData = this.getCustomData();

      if (!currentCustomData) {
         return undefined;
      }
      const pathParts = path.split('.');
      if (pathParts.length === 0) {
         return;
      } else if (pathParts.length === 1) {
         return currentCustomData[pathParts[0]];
      } else {
         let currentPath = currentCustomData;
         for (let i = 0; i < pathParts.length; i++) {
            if (i === pathParts.length - 1) {
               return currentPath[pathParts[i]];
            }

            if (!currentPath[pathParts[i]]) {
               return undefined;
            }
            currentPath = currentPath[pathParts[i]];
         }
      }
   }

   xhr(url: string, settings: {}): any {
      return $cardApi.api.xhr(url, settings);
   }

   /**
    * Event handler to handle model updates
    */
   onModelUpdate(model: {}): void {
      if (model && JSON.stringify(model) !== JSON.stringify(this.model)) {
         this.model = Object.assign({}, model);
         this.broadcast('cardapi.model-update');
      }
   }

   /**
    * Event handler to handle messages
    */
   onMessage(event): void {
      if (event) {
         this.broadcast('cardapi.card-message', { event: event });
      }
   }

   /**
    * Event handler to handle mode updates
    */
   onModeUpdate(mode): void {
      if (mode && JSON.stringify(mode) !== JSON.stringify(this.mode)) {
         this.mode = Object.assign({}, mode);
         this.broadcast('cardapi.mode-update');
      }
   }
}
