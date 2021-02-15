"use strict";

import { getSecondPiece, getViruses } from "./functions.js";
import { SpiningVirus } from "./SpiningVirus.js";
import Game from "./Main.js";
import Counters from "./scores.js";
export default class Board {
  static table = [];
  static elements;
  static viruses = [];
  static countOfViruses = { yl: 0, br: 0, bl: 0 };
  setBoard() {
    this.board = document.getElementById("board");

    for (let i = 0; i < 22; i++) {
      let row = document.createElement("div");
      row.setAttribute("class", "row");

      const lengthOfRow = i < 8 ? 15 : 8;
      for (let a = 0; a < lengthOfRow; a++) {
        let element = document.createElement("div");
        element.setAttribute("class", "element");
        row.appendChild(element.cloneNode(true));
      }

      this.board.append(row);
    }

    for (let i = 0; i <= 22; i++) {
      Board.table.push([]);
      const lengthOfRow = i < 8 ? 15 : 8;
      for (let a = 0; a < lengthOfRow; a++) {
        Board.table[i].push(" ");
      }
    }
    Board.table[5][5] = 0;
    Board.table[4][5] = 0;

    const viruses = getViruses(5 * Game.level);
    Board.viruses.push(...viruses);
    Board.elements = document.querySelectorAll(".element");
    viruses.forEach((virus) => {
      Board.countOfViruses[virus.color]++;
      Board.virusInsertPush(virus);
    });
    const spiningViruses = document.querySelectorAll(".spinningVirus");
    spiningViruses.forEach((spiningVirus) => {
      let color = spiningVirus.id.substr(spiningVirus.id.length - 2);
      const virus = new SpiningVirus(spiningVirus, color);
      virus.animationInterval = setInterval(virus.animation, 250);
      SpiningVirus.all[color] = virus;
    });

    Counters.refreshTopScore();
    Counters.refreshCurrentScore();
    Counters.refreshVirusScore();
    Counters.refreshLevelScore();
  }

  static clearBoard() {
    this.board = document.getElementById("board");
    Board.table = [];
    while (this.board.firstChild) {
      this.board.removeChild(this.board.firstChild);
    }
    const containter = document.getElementById("container");
    containter.style.backgroundImage = `url(../img/${Game.level % 8}_pf.png)`;
    Game.result = "during";
    Game.all[Game.all.length - 1].winBanner.style.opacity = 0;
    Game.all[Game.all.length - 1].startGame();
  }

  static getConstansAddPixa(pixa) {
    let constansAddFirstPiece = pixa.first_piece_y > 8 ? 120 + (pixa.first_piece_y - 8) * 8 : pixa.first_piece_y * 15;
    let constansAddSecondPiece = pixa.second_piece_y > 8 ? 120 + (pixa.second_piece_y - 8) * 8 : pixa.second_piece_y * 15;
    return [constansAddFirstPiece, constansAddSecondPiece];
  }
  static getConstansAddPiece(piece) {
    let constansAdd = piece.position_y > 8 ? 120 + (piece.position_y - 8) * 8 : piece.position_y * 15;
    return constansAdd;
  }
  static pixaClear(pixa) {
    const constansValues = this.getConstansAddPixa(pixa);
    this.elements[constansValues[0] + pixa.first_piece_x].style.backgroundImage = "url()";
    this.elements[constansValues[1] + pixa.second_piece_x].style.backgroundImage = "url()";
  }
  static pixaInsert(pixa) {
    const constansAdd = this.getConstansAddPixa(pixa);
    if (pixa.position === "horizontal") {
      this.elements[constansAdd[0] + pixa.first_piece_x].style.backgroundImage = `url(../img/${pixa.firstColor}_left.png)`;
      this.elements[constansAdd[1] + pixa.second_piece_x].style.backgroundImage = `url(../img/${pixa.secondColor}_right.png)`;
    } else if (pixa.position === "vertical") {
      this.elements[constansAdd[0] + pixa.first_piece_x].style.backgroundImage = `url(../img/${pixa.firstColor}_down.png)`;
      this.elements[constansAdd[1] + pixa.second_piece_x].style.backgroundImage = `url(../img/${pixa.secondColor}_up.png)`;
    }
  }
  static pixaPush(first_piece, second_piece) {
    this.table[first_piece.position_y][first_piece.position_x] = first_piece;
    this.table[second_piece.position_y][second_piece.position_x] = second_piece;
  }

  static pieceClear(piece) {
    const constansAdd = this.getConstansAddPiece(piece);
    this.elements[constansAdd + piece.position_x].style.backgroundImage = "url()";
    this.table[piece.position_y][piece.position_x] = " ";
  }

  static pieceInsertPush(piece) {
    const constansAdd = this.getConstansAddPiece(piece);
    const secondPiece = getSecondPiece(piece, []);
    if (typeof secondPiece === "object") {
      if (piece.position === "horizontal" && piece.position_x < secondPiece.position_x) {
        this.elements[constansAdd + piece.position_x].style.backgroundImage = `url(../img/${piece.color}_left.png)`;
      } else if (piece.position === "horizontal" && piece.position_x > secondPiece.position_x) {
        this.elements[constansAdd + piece.position_x].style.backgroundImage = `url(../img/${piece.color}_right.png)`;
      } else if (piece.position === "vertical" && piece.position_y > secondPiece.position_y) {
        this.elements[constansAdd + piece.position_x].style.backgroundImage = `url(../img/${piece.color}_down.png)`;
      } else if (piece.position === "vertical" && piece.position_y < secondPiece.position_y) {
        this.elements[constansAdd + piece.position_x].style.backgroundImage = `url(../img/${piece.color}_up.png)`;
      }
    } else {
      this.elements[constansAdd + piece.position_x].style.backgroundImage = `url(../img/${piece.color}_dot.png)`;
    }
    this.table[piece.position_y][piece.position_x] = piece;
  }
  static virusInsertPush(virus) {
    const constansAdd = Board.getConstansAddPiece(virus);
    this.elements[constansAdd + virus.position_x].style.backgroundImage = `url(../img/${virus.color}_virus.png)`;
    this.table[virus.position_y][virus.position_x] = virus;
  }

  static handInsert(position) {
    const animationsElemenst = [
      Board.elements[4 * 15 + 14],
      Board.elements[5 * 15 + 13],
      Board.elements[5 * 15 + 14],
      Board.elements[6 * 15 + 13],
      Board.elements[6 * 15 + 14],
      Board.elements[7 * 15 + 14],
    ];
    animationsElemenst.forEach((element) => {
      element.style.backgroundImage = "url()";
    });

    if (position === "up") {
      animationsElemenst[0].style.backgroundImage = `url(../img/hands/${position}_1.png)`;
      animationsElemenst[2].style.backgroundImage = `url(../img/hands/${position}_2.png)`;
      animationsElemenst[4].style.backgroundImage = `url(../img/hands/${position}_3.png)`;
    } else if (position === "middle") {
      animationsElemenst[1].style.backgroundImage = `url(../img/hands/${position}11.png)`;
      animationsElemenst[2].style.backgroundImage = `url(../img/hands/${position}12.png)`;
      animationsElemenst[3].style.backgroundImage = `url(../img/hands/${position}21.png)`;
      animationsElemenst[4].style.backgroundImage = `url(../img/hands/${position}22.png)`;
    } else if (position === "down") {
      animationsElemenst[4].style.backgroundImage = `url(../img/hands/${position}_1.png)`;
      animationsElemenst[5].style.backgroundImage = `url(../img/hands/${position}_2.png)`;
    }
  }
}
