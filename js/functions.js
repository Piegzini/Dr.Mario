import { Pixa, Piece } from "./Pixa.js";
import Board from "./Board.js";
import Game from "./Main.js";

const colors = ["yl", "bl", "br"];

export const getColors = () => {
  const drawn = [colors[Math.floor(Math.random() * colors.length)], colors[Math.floor(Math.random() * colors.length)]];
  return drawn;
};

export const getSecondPiece = (first_piece, alreadyUsedIdes) => {
  //Pobieram sobie id części do której szukam pary
  const id = first_piece.id;
  //Towrzę sobie zmienną która będzie przechowywała znalezioną parę
  let second_piece = "single";

  Board.table.forEach((row) => {
    row.forEach((element) => {
      if (element instanceof Piece && element?.id === id && JSON.stringify(element) !== JSON.stringify(first_piece)) {
        if (!alreadyUsedIdes.includes(element?.id)) second_piece = element;
        else second_piece = "Aready moved";
      }
    });
  });
  return second_piece;
};

export const getViruses = (countOfViruses) => {
  const viruses = [];
  let alreadyUsedPositions = [];

  const roll = (i) => {
    const positions = { Y: Math.floor(Math.random() * 10) + 12, X: Math.floor(Math.random() * 8) };
    if (alreadyUsedPositions.includes(JSON.stringify(positions))) roll(i);
    else {
      viruses.push(new Piece("virus", positions.Y, positions.X, colors[i % 3], "horizontal", i));
      alreadyUsedPositions.push(JSON.stringify(positions));
    }
  };
  for (let i = 0; i < countOfViruses; i++) {
    roll(i);
  }
  return viruses;
};

export const gameActions = (e) => {
  const key = e?.key;
  const amount_of_pixes = Pixa.allPixes.length;
  const current_pixa = Pixa.allPixes[amount_of_pixes - 2];

  if(key !== Game.turnedButton){
    clearInterval(Game.intervalMove);
  }
  if (!Game.flag) {
    Game.turnedButton = key;
    Game.intervalMove = setInterval(moveInTime, 200);
  }
  if (Game.flag === false && (key == "ArrowRight" || key == "d" || key == "D")) current_pixa.moveRight(), (Game.flag = true);
  else if (Game.flag === false && (key == "ArrowLeft" || key == "a" || key == "A")) current_pixa.moveLeft(), (Game.flag = true);
  else if (Game.flag === false && (key == "ArrowDown" || key == "s" || key == "S")) current_pixa.descent(true), (Game.flag = true);
  else if (Game.flag === false && (key == "ArrowUp" || key == "w" || key == "W")) current_pixa.rotation("left"), (Game.flag = true);
  else if (Game.flag === false && key == "Shift") current_pixa.rotation("right"), (Game.flag = true);

  document.addEventListener("keyup", () => {
    clearInterval(Game.intervalMove);
    Game.flag = false;
    Game.turnedButton = 0;
  });
};

const moveInTime = () => {
  const amount_of_pixes = Pixa.allPixes.length;
  const current_pixa = Pixa.allPixes[amount_of_pixes - 2];
  if (Game.turnedButton == "ArrowRight" || Game.turnedButton == "d" || Game.turnedButton == "D") current_pixa.moveRight();
  else if (Game.turnedButton == "ArrowLeft" || Game.turnedButton == "a" || Game.turnedButton == "A") current_pixa.moveLeft();
  else if (Game.turnedButton == "ArrowDown" || Game.turnedButton == "s" || Game.turnedButton == "S") current_pixa.descent(true);
  else if (Game.turnedButton == "ArrowUp" || Game.turnedButton == "w" || Game.turnedButton == "W") current_pixa.rotation("left");
  else if (Game.turnedButton == "Shift") current_pixa.rotation("right");
};
