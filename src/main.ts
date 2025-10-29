import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import '@angular/compiler';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}
if (environment.logo_change_key === 'Vsolv') {
  document.title = 'VsolV';
} else if (environment.logo_change_key === 'KVB') {
  document.title = 'KVB';
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
