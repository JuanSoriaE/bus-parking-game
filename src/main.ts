import './style.css';
import Game from './core/Game';

const game: Game = new Game();

const startGameButton: HTMLButtonElement = document.getElementById("start-game-button") as HTMLButtonElement;

startGameButton.addEventListener("click", () => {
  startGameButton.disabled = true;
  game.start()
});