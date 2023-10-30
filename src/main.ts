import './style.css';
import Game from './core/Game';

const game: Game = new Game();

const startGameButton: HTMLButtonElement = document.getElementById("start-game-button") as HTMLButtonElement;

startGameButton.addEventListener("click", () => game.start());