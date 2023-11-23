import AbstractView from "../js/AbstractView.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("Country Detail");
  }

  async getHTML() {
    return `    
    <main class="rest-countries">
    <header class="header">
      <h1 class="heading-primary">Where in the world?</h1>

      <div class="header__theme-switch-container"></div>
    </header>
  </main>`;
  }
}
