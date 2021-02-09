import { Pixa, Piece } from "./Pixa.js";
import Board from "./Board.js";

export const getColors = () => {
  const colors = ["yellow", "#346173", "blue"];
  const drawn = [colors[Math.floor(Math.random() * colors.length)], colors[Math.floor(Math.random() * colors.length)]];
  return drawn;
};

export const getSecondPiece = (first_piece, alreadyUsedIdes) => {
  //Pobieram sobie id części do której szukam pary
  const id = first_piece.id;
  //Towrzę sobie zmienną która będzie przechowywała znalezioną parę
  let second_piece = "single"

  Board.table.forEach((row) => {
    row.forEach((element) => {
      // Po kolei tłumacze warunki jaki musi spełniać element, aby być drugą częścią:
      // 1. Musi należeć do instacji Piece, czyli musi być obiektem z klasy Piece,
      // 2. Musi być to inny element od pierwszej części tabletki ( używam tutaj JSON.stringify żeby móc z latwością porównać obiekty),
      // 3. Id musi mieć takie samo jak pierwsza część,
      // 4. Id nie może znajdować się na liście już użytych identyfikatorów
      if (element instanceof Piece && element?.id === id && JSON.stringify(element) !== JSON.stringify(first_piece)) {
        if (!alreadyUsedIdes.includes(element?.id)) second_piece = element;
        else second_piece = "Aready moved";
      }
    });
  });
  return second_piece;
};

export const gameActions = (e) => {
  const key = e.key;

  const amount_of_pixes = Pixa.allPixes.length;
  const current_pixa = Pixa.allPixes[amount_of_pixes - 1];

  if (key == "ArrowRight" || key == "d" || key == "D") current_pixa.moveRight();
  else if (key == "ArrowLeft" || key == "a" || key == "A") current_pixa.moveLeft();
  else if (key == "ArrowDown" || key == "s" || key == "S") current_pixa.descent(true);
  else if (key == "ArrowUp" || key == "w" || key == "W") current_pixa.rotation("left");
  else if (key == "Shift") current_pixa.rotation("right");
};
