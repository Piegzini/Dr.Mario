"use strict";

import { getSecondPiece, getViruses } from "./functions.js";

export default class Board {
  static table = [];
  static elements;
  static viruses = [];
  setBoard() {
    this.board = document.getElementById("board");

    for (let i = 0; i < 16; i++) {
      let row = document.createElement("div");
      row.setAttribute("class", "row");

      for (let a = 0; a < 8; a++) {
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
  static pixaClear(pixa) {
    this.elements[pixa.first_piece_y * 8 + pixa.first_piece_x].style.backgroundImage = "url()";
    this.elements[pixa.second_piece_y * 8 + pixa.second_piece_x].style.backgroundImage = "url()";
  }

  static pixaInsert(pixa) {
    if (pixa.position === "horizontal") {
      this.elements[pixa.first_piece_y * 8 + pixa.first_piece_x].style.backgroundImage = `url(../img/${pixa.firstColor}_left.png)`;
      this.elements[pixa.second_piece_y * 8 + pixa.second_piece_x].style.backgroundImage = `url(../img/${pixa.secondColor}_right.png)`;
    } else if (pixa.position === "vertical") {
      this.elements[pixa.first_piece_y * 8 + pixa.first_piece_x].style.backgroundImage = `url(../img/${pixa.firstColor}_down.png)`;
      this.elements[pixa.second_piece_y * 8 + pixa.second_piece_x].style.backgroundImage = `url(../img/${pixa.secondColor}_up.png)`;
    }
  }
  static pixaPush(first_piece, second_piece) {
    this.table[first_piece.position_y][first_piece.position_x] = first_piece;
    this.table[second_piece.position_y][second_piece.position_x] = second_piece;
  }

  static pieceClear(piece) {
    this.elements[piece.position_y * 8 + piece.position_x].style.backgroundImage = "url()";
    this.table[piece.position_y][piece.position_x] = " ";
  }

  static pieceInsertPush(piece) {
    const secondPiece = getSecondPiece(piece, []);
    if (typeof secondPiece === "object") {
      if (piece.position === "horizontal" && piece.position_x < secondPiece.position_x) {
        this.elements[piece.position_y * 8 + piece.position_x].style.backgroundImage = `url(../img/${piece.color}_left.png)`;
      }else if(piece.position === "horizontal" && piece.position_x > secondPiece.position_x){
        this.elements[piece.position_y * 8 + piece.position_x].style.backgroundImage = `url(../img/${piece.color}_right.png)`;
      }else if(piece.position === "vertical" && piece.position_y > secondPiece.position_y){
        this.elements[piece.position_y * 8 + piece.position_x].style.backgroundImage = `url(../img/${piece.color}_down.png)`
      }else if(piece.position === "vertical" && piece.position_y < secondPiece.position_y){
        this.elements[piece.position_y * 8 + piece.position_x].style.backgroundImage = `url(../img/${piece.color}_up.png)`
      }
    } else {
      this.elements[piece.position_y * 8 + piece.position_x].style.backgroundImage = `url(../img/${piece.color}_dot.png)`;
    }
    this.table[piece.position_y][piece.position_x] = piece;
  }
  static virusInsertPush(virus) {
    this.elements[virus.position_y * 8 + virus.position_x].style.backgroundImage = `url(../img/${virus.color}_virus.png)`;
    this.table[virus.position_y][virus.position_x] = virus;
  }
}
