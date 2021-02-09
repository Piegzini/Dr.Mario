"use strict";
import { Pixa, Piece } from "./Pixa.js";
import Board from "./Board.js";
import { getColors, gameActions, getSecondPiece } from "./functions.js";
export default class Game {
  static fall_interval;
  static involuntary_fall_interval;
  constructor() {
    Board.setBoard();
  }

  startGame() {
    const pixa = new Pixa(Pixa.allPixes.length, getColors());
    Board.insertOnBoard(pixa);
    Pixa.allPixes.push(pixa);

    document.addEventListener("keydown", gameActions);

    Game.fall_interval = setInterval(() => pixa.descent(), 400);
  }

  static kiling(piece) {
    let possibilities = [
      [0, 1],
      [1, 0],
      [0, -1],
      [-1, 0],
    ];

    let matchingComponents_vertical = [piece];
    let matchingComponents_horizontal = [piece];
    const firstColor = piece.color;

    possibilities.forEach((possibility) => {
      let possibility_y = possibility[0];
      let possibility_x = possibility[1];
      let tableElement = Board.table[possibility_y + piece.position_y][possibility_x + piece.position_x];
      while (tableElement?.color === firstColor) {
        possibility[0] == 0 ? matchingComponents_horizontal.push(tableElement) : matchingComponents_vertical.push(tableElement);
        possibility_x += possibility[1];
        possibility_y += possibility[0];
        tableElement = Board.table[possibility_y + piece.position_y][possibility_x + piece.position_x];
      }
    });

    return {
      color: firstColor,
      vertical: matchingComponents_vertical,
      horizontal: matchingComponents_horizontal,
    };
  }

  static resultOfKiling(first_piece, second_piece) {
    const results = [Game.kiling(first_piece), Game.kiling(second_piece)];

    results.forEach((part) => {
      for (let attr in part) {
        if (part[attr].length >= 4 && attr !== "color") {
          part[attr].forEach((piece) => {
            Board.elements[piece.position_y * 8 + piece.position_x].style.backgroundColor = "white";
            Board.table[piece.position_y][piece.position_x] = " ";
          });
        }
      }
    });
  }

  static checkingFalling() {
    //Zatrzymuje tworzenie nowych tabletek i na wszelki wyłączam gameActions
    clearInterval(Game.fall_interval);
    document.removeEventListener("keydown", gameActions);
    
    let countPiecesToFall = 0;
    Game.involuntary_fall_interval = setInterval(() => {
      let piecesToFall = [];
      let alreadyUsedIdes = [];
      for (let i = 15; i >= 0; i--) {
        const row = Board.table[i];
        let pieces = row.filter((element) => (element instanceof Piece ? element : null));
        pieces.forEach((first_piece) => {
          const second_piece = getSecondPiece(first_piece, alreadyUsedIdes);
          if (typeof(second_piece) === "object") {
            if (first_piece.position === "horizontal" && first_piece.position_y + 1 !== 16 && second_piece.position_y + 1 !== 16) {
              if (Board.table[first_piece.position_y + 1][first_piece.position_x] === " " && Board.table[second_piece.position_y + 1][second_piece.position_x] === " ") {
                console.log("Spada podwójny połóżony");
                piecesToFall.push(first_piece, second_piece);
                alreadyUsedIdes.push(first_piece.id);
              }
            } else if (first_piece.position === "vertical" && first_piece.position_y + 1 !== 16) {
              if (Board.table[first_piece.position_y + 1][first_piece.position_x] === " ") {
                console.log("Spada podwójny pionowy");
                piecesToFall.push(first_piece, second_piece);
                alreadyUsedIdes.push(first_piece.id);
              }
            }
          } else if(second_piece === 'single') {
            if (Board.table[first_piece.position_y + 1][first_piece.position_x] === " " && first_piece.position_y + 1 !== 16) {
              console.log("Spada pojedyńczy");
              piecesToFall.push(first_piece);
              alreadyUsedIdes.push(first_piece.id);
            }
          }
        });
      }

      piecesToFall.forEach((piece) => {
        Board.clearPiece(piece);
        piece.position_y++;
        Board.fallPiece(piece);
      });

      countPiecesToFall = piecesToFall.length;
      if (countPiecesToFall === 0) {
        clearInterval(Game.involuntary_fall_interval);

        const pixa = new Pixa(Pixa.allPixes.length, getColors());
        Board.insertOnBoard(pixa);
        
        document.addEventListener("keydown", gameActions);
        
        Pixa.allPixes.push(pixa);
        clearInterval(Game.fall_interval);
        Game.fall_interval = setInterval(() => pixa.descent(), 400);
      }
    }, 1000);
  }
}

const newGame = new Game();
newGame.startGame();
