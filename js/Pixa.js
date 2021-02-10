"use strict";
import Board from "./Board.js";
import { getColors } from "./functions.js";
import Game from "./Main.js";


export class Piece {
  constructor(id, position_y, position_x, color, position) {
    this.id = id;
    this.position_y = position_y;
    this.position_x = position_x;
    this.color = color;
    this.position = position;
  }
}

export class Pixa {
  static allPixes = [];

  constructor(id, colors, position = "horizontal") {
    this.id = id;
    this.firstColor = colors[0];
    this.secondColor = colors[1];
    this.position = position;
    this.first_piece_y = 1;
    this.first_piece_x = 3;
    this.second_piece_y = 1;
    this.second_piece_x = 4;
  }
  move(place) {
    Board.pixaClear(this);
    this.first_piece_x += place;
    this.second_piece_x += place;
    Board.pixaInsert(this);
  }
  moveRight() {
    if (this.first_piece_x < 7 && this.second_piece_x < 7 && Board.table[this.second_piece_y][this.second_piece_x + 1] === " " && Board.table[this.first_piece_y][this.first_piece_x + 1] == " ")
      this.move(1);
  }
  moveLeft() {
    if (this.first_piece_x > 0 && this.second_piece_x > 0 && Board.table[this.first_piece_y][this.first_piece_x - 1] === " " && Board.table[this.second_piece_y][this.second_piece_x - 1] === " ")
      this.move(-1);
  }
  rotation(direction) {
    Board.pixaClear(this);
    if (this.position === "horizontal" && Board.table[this.first_piece_y - 1][this.first_piece_x] === " ") {
      this.second_piece_x = this.first_piece_x;
      this.second_piece_y = this.first_piece_y - 1;

      if (direction === "right") [this.firstColor, this.secondColor] = [this.secondColor, this.firstColor];

      this.position = "vertical";
    } else if (this.position === "vertical" && Board.table[this.first_piece_y][this.first_piece_x + 1] === " ") {
      this.second_piece_x = this.first_piece_x + 1;
      this.second_piece_y++;

      if (direction === "left") [this.firstColor, this.secondColor] = [this.secondColor, this.firstColor];

      this.position = "horizontal";
    } else if (this.position === "vertical" && this.second_piece_x === 7 && Board.table[this.first_piece_y][7] === " " && Board.table[this.first_piece_y][6] === " ") {
      this.second_piece_x = 7;
      this.first_piece_x = 6;
      this.second_piece_y++;

      if (direction === "left") [this.firstColor, this.secondColor] = [this.secondColor, this.firstColor];

      this.position = "horizontal";
    }
    Board.pixaInsert(this);
  }

  descent(turnedByClick) {
    if (Board.table[this.second_piece_y + 1][this.second_piece_x] == !" " && Board.table[this.first_piece_y + 1][this.first_piece_x] == !" " && this.first_piece_y < Board.table.length - 2 && this.second_piece_y < Board.table.length - 2) {
      Board.pixaClear(this);
      //Opdadanie tak zwane
      this.first_piece_y++;
      this.second_piece_y++;
      //Jeśli jest spadanie jest wywołane poprzez kliknięcie, to zmieniam interwał na szybszy { tak ma być \^_^/ }
      if (turnedByClick) {
        clearInterval(Game.fall_interval);
        Game.fall_interval = setInterval(() => this.descent(), 20);
      }
      //Wstawiam pixe na planszy
      Board.pixaInsert(this);
    } else {
      //Towrze sobie nowe obiekty klasy piece, aby wrzycić je do tabeli odzwierciedlającej plansze gry
      const first_piece = new Piece(this.id, this.first_piece_y, this.first_piece_x, this.firstColor, this.position);
      const second_piece = new Piece(this.id, this.second_piece_y, this.second_piece_x, this.secondColor, this.position);
      Board.pixaPush(first_piece, second_piece);

      Board.pixaInsert(this);
      Game.kill([first_piece, second_piece]);

      Game.checkingFalling();
    }
  }
}


