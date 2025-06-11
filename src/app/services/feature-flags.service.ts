import { Injectable } from '@angular/core';
import {
  RemoteConfig,
  fetchAndActivate,
  getValue,
} from '@angular/fire/remote-config';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FeatureFlagsService {
  private readonly CATEGORY_COLORS_FLAG = 'enable_category_colors';
  private categoryColorsEnabled = new BehaviorSubject<boolean>(false);

  constructor(private remoteConfig: RemoteConfig) {
    this.initializeRemoteConfig();
  }

  private async initializeRemoteConfig() {
    try {
      const fetchResult = await fetchAndActivate(this.remoteConfig);
      const categoryColorsFlag = getValue(
        this.remoteConfig,
        this.CATEGORY_COLORS_FLAG
      );
      const flagValue = categoryColorsFlag.asBoolean();
      this.categoryColorsEnabled.next(flagValue);
    } catch (error) {
      console.error('Error in remote config:', error);
      this.categoryColorsEnabled.next(false);
    }
  }

  async refreshConfig() {
    await this.initializeRemoteConfig();
  }

  isCategoryColorsEnabled(): Observable<boolean> {
    return this.categoryColorsEnabled.asObservable();
  }
}
