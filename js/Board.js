"use strict";

import { getSecondPiece, getViruses, countOfAnimationRows } from "./functions.js";

export default class Board {
  static table = [];
  static elements;
  static viruses = [];
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

    for (let i = 0; i <= 16; i++) {
      Board.table.push([]);
      for (let a = 0; a < 8; a++) {
        Board.table[i].push(" ");
      }
    }
    const viruses = getViruses(3);
    Board.viruses.push(...viruses);
    Board.elements = document.querySelectorAll(".element");

    viruses.forEach((virus) => {
      Board.virusInsertPush(virus);
    });
  }

  // Tutaj są wszystkie akcje związane z planszą, tabelą i pixą, czyli rysowanie, czyszczenie planszy oraz umiejscowienie w tabeli logicznej
  // static getConstansOddPixa(pixa) {
  //   let constansAddFirstPiece = 0;
  //   let constansAddSecondPiece = 0;
  //   if (pixa.first_piece_y === 0) constansAddFirstPiece = 90;
  //   else if (pixa.first_piece_y === 1) constansAddFirstPiece = 90 + 7;
  //   else if (pixa.first_piece_y > 1) constansAddFirstPiece = 90 + 14;
  //   if (pixa.second_piece_y === 0) constansAddSecondPiece = 90;
  //   else if (pixa.second_piece_y === 1) constansAddSecondPiece = 90 + 7;
  //   else if (pixa.second_piece_y > 1) constansAddSecondPiece = 90 + 14;
  //   return [constansAddFirstPiece, constansAddSecondPiece];
  // }

  static getConstanOddPiece(piece) {
    let constansAdd = 0;
    if (piece.position_y === 0) constansAdd = 90;
    else if (piece.position_y === 1) constansAdd = 90 + 7;
    else if (piece.position_y > 1) constansAdd = 90 + 14;
    return constansAdd;
  }

  static getConstansAddPixa(pixa) {
    let constansAddFirstPiece = pixa.first_piece_y > 8 ? 120 + (pixa.first_piece_y - 8) * 8 : pixa.first_piece_y * 15;
    let constansAddSecondPiece = pixa.second_piece_y > 8 ? 120 + (pixa.second_piece_y - 8) * 8 : pixa.second_piece_y * 15;
    return [constansAddFirstPiece, constansAddSecondPiece];
  }

  static getConstansAddPiece(piece) {
    let constansAdd = 0;
    piece.position_y > 8 ? (constansAdd = 120 + (piece.position_y - 8) * 8) : piece.position_y * 15;
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
    this.table[first_piece.position_y - countOfAnimationRows][first_piece.position_x] = first_piece;
    this.table[second_piece.position_y - countOfAnimationRows][second_piece.position_x] = second_piece;
    console.log(this.table);
  }

  static pieceClear(piece) {
    const constansAdd = this.getConstansAddPiece(piece);
    this.elements[constansAdd + piece.position_x].style.backgroundImage = "url()";
    this.table[piece.position_y - countOfAnimationRows][piece.position_x] = " ";
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
    this.table[piece.position_y - countOfAnimationRows][piece.position_x] = piece;
  }
  static virusInsertPush(virus) {
    const constansAdd = Board.getConstansAddPiece(virus)
    this.elements[constansAdd + virus.position_x].style.backgroundImage = `url(../img/${virus.color}_virus.png)`;
    this.table[virus.position_y - countOfAnimationRows][virus.position_x] = virus;
  }
}
