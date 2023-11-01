export default class InputHandler {
  pressedKeys: Array<string>;

  constructor() {
    this.pressedKeys = new Array<string>;

    this.initEventListeners();
  }

  initEventListeners() {
    window.addEventListener("keydown", (e: KeyboardEvent) => this.addPressedKey(e.key));
    window.addEventListener("keyup", (e: KeyboardEvent) => this.deletePressedKey(e.key));
  }

  addPressedKey(key: string) {
    if (this.pressedKeys.indexOf(key) !== -1) return;
    this.pressedKeys.push(key);
  }

  deletePressedKey(key: string) {
    const idx: number = this.pressedKeys.indexOf(key);
    if (idx === -1) return;

    this.pressedKeys[idx] = this.pressedKeys[this.pressedKeys.length - 1];
    this.pressedKeys.pop();
  }
}