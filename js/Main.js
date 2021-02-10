"use strict";
import { Pixa, Piece } from "./Pixa.js";
import Board from "./Board.js";
import { getColors, gameActions, getSecondPiece, getViruses } from "./functions.js";
export default class Game {
  static fall_interval;
  static allGames = [];
  static points = 0;
  constructor() {
    this.Board = new Board();
    Game.allGames.push(this);
  }

  startGame() {
    this.Board.setBoard();

    const pixa = new Pixa(Pixa.allPixes.length, getColors());
    Board.pixaInsert(pixa);
    Pixa.allPixes.push(pixa);
    document.addEventListener("keydown", gameActions);

    setTimeout(() => {
      Game.fall_interval = setInterval(() => pixa.descent(), 400);
    }, 400);
  }
  static getMatchingToKillElements(piece) {
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

  static isKill(pieces) {
    const results = [];
    let isKill = false;
    pieces.forEach((piece) => {
      results.push(Game.getMatchingToKillElements(piece));
    });

    results.forEach((part) => {
      for (let attr in part) {
        if (part[attr].length >= 4 && attr !== "color") {
          isKill = true;
          break;
        }
      }
    });
    return isKill;
  }

  static kill(pieces) {
    const results = [];
    pieces.forEach((piece) => {
      results.push(Game.getMatchingToKillElements(piece));
    });

    results.forEach((part) => {
      for (let attr in part) {
        if (part[attr].length >= 4 && attr !== "color") {
          part[attr].forEach((piece) => {
            if (piece.id === "virus" && Board.viruses.includes(piece)) {
              const index = Board.viruses.findIndex((element) => element === piece);
              Board.viruses.splice(index, 1);
              Game.points += 100;
            }
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
    let allMovedPieces = [];
    Game.fall_interval = setInterval(() => {
      let piecesToFallNow = [];
      let alreadyUsedIdes = [];
      for (let i = 15; i >= 0; i--) {
        const row = Board.table[i];
        let pieces = row.filter((element) => (element instanceof Piece && element?.id !== "virus" ? element : null));
        pieces.forEach((first_piece) => {
          const second_piece = getSecondPiece(first_piece, alreadyUsedIdes);
          if (typeof second_piece === "object") {
            if (first_piece.position === "horizontal" && first_piece.position_y + 1 !== Board.table.length - 1 && second_piece.position_y + 1 !== Board.table.length - 1) {
              if (Board.table[first_piece.position_y + 1][first_piece.position_x] === " " && Board.table[second_piece.position_y + 1][second_piece.position_x] === " ") {
                piecesToFallNow.push(first_piece, second_piece);
                alreadyUsedIdes.push(first_piece.id);
              }
            } else if (first_piece.position === "vertical" && first_piece.position_y + 1 !== Board.table.length - 1) {
              if (Board.table[first_piece.position_y + 1][first_piece.position_x] === " ") {
                piecesToFallNow.push(first_piece, second_piece);
                alreadyUsedIdes.push(first_piece.id);
              }
            }
          } else if (second_piece === "single") {
            if (Board.table[first_piece.position_y + 1][first_piece.position_x] === " " && first_piece.position_y + 1 !== Board.table.length - 1) {
              piecesToFallNow.push(first_piece);
              alreadyUsedIdes.push(first_piece.id);
            }
          }
        });
      }

      piecesToFallNow.forEach((piece) => {
        Board.pieceClear(piece);
        piece.position_y++;
        !allMovedPieces.includes(piece) ? allMovedPieces.push(piece) : null;
        Board.pieceInsertPush(piece);
      });

      if (piecesToFallNow.length === 0) {
        clearInterval(Game.fall_interval);
        if (Game.isKill(allMovedPieces)) {
          Game.kill(allMovedPieces);
          Game.checkingFalling();
        } else {
          if (Board.viruses.length === 0) {
            localStorage.setItem(localStorage.length, Game.points);
            clearInterval(Game.fall_interval);
            document.removeEventListener("keydown", gameActions);
            console.log("Wygrałeś koniec gry");
          } else {
            const pixa = new Pixa(Pixa.allPixes.length, getColors());
            Board.pixaInsert(pixa);

            document.addEventListener("keydown", gameActions);

            Pixa.allPixes.push(pixa);
            clearInterval(Game.fall_interval);
            Game.fall_interval = setInterval(() => pixa.descent(), 400);
          }
        }
      }
    }, 100);
  }
}

const newGame = new Game();
newGame.startGame();
