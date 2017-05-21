import {Router, RouterConfiguration} from 'aurelia-router';

export class App {
  public router: Router;

  public configureRouter(config: RouterConfiguration, router: Router) {
    config.title = 'Aurelia';
    config.map([
      { route: ['', 'home'], name: 'home',      moduleId: 'pages/home',      nav: true, title: 'Home' }
    ]);

    this.router = router;
  }
}
