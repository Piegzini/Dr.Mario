"use strict";

export default class Board {
  static table = [];
  static elements;

  static setBoard() {
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
      this.table.push([]);
      for (let a = 0; a < 8; a++){
        this.table[i].push(" ");
      } 
    }

    this.elements = document.querySelectorAll(".element");
  }

  // Tutaj są wszystkie akcje związane z planszą, tabelą i pixą, czyli rysowanie, czyszczenie planszy oraz umiejscowienie w tabeli logicznej
  static clearBoard(pixa) {
    this.elements[pixa.first_piece_y * 8 + pixa.first_piece_x].style.backgroundColor = "white";
    this.elements[pixa.second_piece_y * 8 + pixa.second_piece_x].style.backgroundColor = "white";
  }

  static insertOnBoard(pixa) {
    this.elements[pixa.first_piece_y * 8 + pixa.first_piece_x].style.backgroundColor = pixa.firstColor;
    this.elements[pixa.second_piece_y * 8 + pixa.second_piece_x].style.backgroundColor = pixa.secondColor;
  }
  static insertInTable(first_piece, second_piece) {
    this.table[first_piece.position_y][first_piece.position_x] = first_piece;
    this.table[second_piece.position_y][second_piece.position_x] = second_piece;
  }

  static clearPiece(piece) {
    this.elements[piece.position_y * 8 + piece.position_x].style.backgroundColor = "white";
    this.table[piece.position_y][piece.position_x] = " ";
  }

  static fallPiece(piece) {
    this.elements[piece.position_y * 8 + piece.position_x].style.backgroundColor = piece.color;
    this.table[piece.position_y][piece.position_x] = piece;
  }
}
