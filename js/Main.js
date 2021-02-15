"use strict";
import { Pixa, Piece } from "./Pixa.js";
import Board from "./Board.js";
import { getColors, gameActions, getSecondPiece, getViruses } from "./functions.js";
import { animation } from "./animations.js";
import { SpiningVirus } from "./SpiningVirus.js";
import Counters from "./scores.js";
export default class Game {
  static fall_interval;
  static intervalMove;
  static all = [];
  static points = 0;
  static flag = false;
  static turnedButton;
  static result = "during";
  static level = 1;
  static boards = [];
  constructor() {
    this.lossBanner = document.getElementById("loss");
    this.winBanner = document.getElementById("win");
    this.lossMario = document.getElementById("lossMario");
    this.brownVirus = document.getElementById("virus_br");
    this.yellowVirus = document.getElementById("virus_yl");
    this.blueVirus = document.getElementById("virus_bl");
    Game.all.push(this);
  }

  startGame() {
    const board = new Board();
    board.setBoard();
    Game.boards.push(board);
    const pixa = new Pixa(Pixa.allPixes.length, getColors());
    Board.pixaInsert(pixa);
    Pixa.allPixes.push(pixa);
    animation();
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
    console.log(results);
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

  static kill(pieces, callback) {
    const results = [];
    pieces.forEach((piece) => {
      results.push(Game.getMatchingToKillElements(piece));
    });

    results.forEach((part) => {
      for (let attr in part) {
        if (part[attr].length >= 4 && attr !== "color") {
          part[attr].forEach((piece) => {
            const constansAdd = Board.getConstansAddPiece(piece);
            if (piece.id === "virus" && Board.viruses.includes(piece)) {
              const index = Board.viruses.findIndex((element) => element === piece);
              Board.viruses.splice(index, 1);
              Game.points += 100;
              Counters.refreshCurrentScore();
              Counters.refreshVirusScore();

              Board.countOfViruses[piece.color]--;

              SpiningVirus.all[piece.color].lives = false;
              Board.elements[constansAdd + piece.position_x].style.backgroundImage = `url(../img/${piece.color}_x.png)`;
            } else {
              Board.elements[constansAdd + piece.position_x].style.backgroundImage = `url(../img/${piece.color}_o.png)`;
            }
          });
        }
      }
    });
    clearInterval(Game.fall_interval);
    setTimeout(() => {
      results.forEach((part) => {
        for (let attr in part) {
          if (part[attr].length >= 4 && attr !== "color") {
            part[attr].forEach((piece) => {
              if (typeof getSecondPiece(piece, []) === "object" && piece.id !== "virus") {
                const second_piece = getSecondPiece(piece, []);
                const constansAdd = Board.getConstansAddPiece(second_piece);
                Board.elements[constansAdd + second_piece.position_x].style.backgroundImage = `url(../img/${second_piece.color}_dot.png)`;
              }
              const constansAdd = Board.getConstansAddPiece(piece);
              Board.elements[constansAdd + piece.position_x].style.backgroundImage = `url()`;
              Board.table[piece.position_y][piece.position_x] = " ";
            });
          }
        }
      });
      callback();
    }, 500);
  }
  static checkingFalling() {
    //Zatrzymuje tworzenie nowych tabletek i na wszelki wyłączam gameActions
    clearInterval(Game.fall_interval);
    document.removeEventListener("keydown", gameActions);
    let allMovedPieces = [];
    Game.fall_interval = setInterval(() => {
      let piecesToFallNow = [];
      let alreadyUsedIdes = [];
      for (let i = 22; i >= 0; i--) {
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
        if (Game.isKill(allMovedPieces)) {
          Game.kill(allMovedPieces, Game.checkingFalling);
        } else {
          if (Board.viruses.length === 0) {
            const highestScore = localStorage.getItem("highestScore");
            Game.points > highestScore ? localStorage.setItem("highestScore", Game.points) : null;
            clearInterval(Game.fall_interval);
            document.removeEventListener("keydown", gameActions);
            Game.level++;
            const currentGame = Game.all[Game.all.length - 1];
            currentGame.winBanner.style.opacity = 1;
            setTimeout(() => {
              Board.clearBoard();
            }, 1000);
            Game.result = "win";
          } else {
            clearInterval(Game.fall_interval);
            animation();
          }
        }
      }
    }, 40);
  }
}

const newGame = new Game();
newGame.startGame();
