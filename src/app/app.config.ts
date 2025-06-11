import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { initializeApp } from '@angular/fire/app';
import { getRemoteConfig } from '@angular/fire/remote-config';
import { environment } from '../environments/environment';
import { provideFirebaseApp } from '@angular/fire/app';
import { provideRemoteConfig } from '@angular/fire/remote-config';

const app = initializeApp(environment.firebase);
const remoteConfig = getRemoteConfig(app);
remoteConfig.settings.minimumFetchIntervalMillis = 0;
remoteConfig.defaultConfig = {
  enable_category_colors: false,
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideFirebaseApp(() => app),
    provideRemoteConfig(() => remoteConfig),
  ],
};
