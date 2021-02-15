"use strict";
import Board from "./Board.js";
import { gameActions } from "./functions.js";
import Game from "./Main.js";
import { SpiningVirus } from "./SpiningVirus.js";

export class Piece {
  constructor(id, position_y, position_x, color, position, virusNumber = null) {
    this.id = id;
    this.position_y = position_y;
    this.position_x = position_x;
    this.color = color;
    this.position = position;
    this.variusNumber = virusNumber;
  }
}

export class Pixa {
  static allPixes = [];

  constructor(id, colors, position = "horizontal") {
    this.id = id;
    this.firstColor = colors[0];
    this.secondColor = colors[1];
    this.position = position;
    this.first_piece_y = 3;
    this.first_piece_x = 13;
    this.second_piece_y = 3;
    this.second_piece_x = 14;
  }
  move(place) {
    Board.pixaClear(this);
    this.first_piece_x += place;
    this.second_piece_x += place;
    Board.pixaInsert(this);
  }
  moveRight() {
    if (this.first_piece_y > 5 && this.second_piece_y > 5) {
      if (this.first_piece_x < 7 && this.second_piece_x < 7 && Board.table[this.second_piece_y][this.second_piece_x + 1] === " " && Board.table[this.first_piece_y][this.first_piece_x + 1] === " ")
        this.move(1);
    } else if (this.second_piece_y <= 5 && this.position === "vertical") {
      if (this.first_piece_x === 3) {
        this.move(1);
      }
    }
  }
  moveLeft() {
    if (this.first_piece_y > 5 && this.second_piece_y > 5) {
      if (this.first_piece_x > 0 && this.second_piece_x > 0 && Board.table[this.first_piece_y][this.first_piece_x - 1] === " " && Board.table[this.second_piece_y][this.second_piece_x - 1] === " ")
        this.move(-1);
    } else if (this.second_piece_y <= 5 && this.position === "vertical") {
      if (this.first_piece_x === 4) {
        this.move(-1);
      }
    }
  }
  rotation(direction, animation = false) {
    Board.pixaClear(this);
    if (this.position === "horizontal" && this.first_piece_y === 0 && this.second_piece_y === 0 && (this.first_piece_x < 3 || this.second_piece_x > 4)) {
    } else if (this.position === "horizontal" && Board.table[this.first_piece_y - 1][this.first_piece_x] === " ") {
      this.second_piece_x = this.first_piece_x;
      this.second_piece_y = this.first_piece_y - 1;

      if (direction === "right") [this.firstColor, this.secondColor] = [this.secondColor, this.firstColor];

      this.position = "vertical";
    } else if (
      (this.position === "vertical" &&
        Board.table[this.first_piece_y][this.first_piece_x + 1] !== " " &&
        Board.table[this.first_piece_y][this.first_piece_x] === " " &&
        Board.table[this.first_piece_y][this.first_piece_x - 1] === " ") ||
      animation
    ) {
      this.second_piece_x = this.second_piece_x;
      this.first_piece_x = this.first_piece_x - 1;
      this.second_piece_y++;

      if (direction === "left") [this.firstColor, this.secondColor] = [this.secondColor, this.firstColor];

      this.position = "horizontal";
    } else if (this.position === "vertical" && Board.table[this.first_piece_y][this.first_piece_x + 1] === " ") {
      this.second_piece_x = this.first_piece_x + 1;
      this.second_piece_y++;

      if (direction === "left") [this.firstColor, this.secondColor] = [this.secondColor, this.firstColor];

      this.position = "horizontal";
    }

    Board.pixaInsert(this);
  }

  descent(turnedByClick) {
    if (
      Board.table[this.second_piece_y + 1][this.second_piece_x] == !" " &&
      Board.table[this.first_piece_y + 1][this.first_piece_x] == !" " &&
      this.first_piece_y < Board.table.length - 2 &&
      this.second_piece_y < Board.table.length - 2
    ) {
      Board.pixaClear(this);
      //Opdadanie tak zwane
      this.first_piece_y++;
      this.second_piece_y++;
      //Jeśli jest spadanie jest wywołane poprzez kliknięcie, to zmieniam interwał na szybszy { tak ma być \^_^/ }
      if (turnedByClick) {
        document.removeEventListener("keydown", gameActions);
        clearInterval(Game.fall_interval);
        Game.fall_interval = setInterval(() => this.descent(), 20);
      }
      Board.pixaInsert(this);
    } else {
      clearInterval(Game.intervalMove);
      if (this.second_piece_y <= 5 && this.first_piece_y <= 5) {
        const currentGame = Game.all[Game.all.length - 1];
        currentGame.lossMario.style.opacity = 1;
        currentGame.lossBanner.style.opacity = 1;
        clearInterval(Game.fall_interval);

        const highestScore = localStorage.getItem("highestScore");
        Game.points > highestScore ? localStorage.setItem("highestScore", Game.points) : null;
        document.removeEventListener("keydown", gameActions);
        Game.result = "loss";
        clearInterval(SpiningVirus.circleAnimationInterval);
      } else {
        //Towrze sobie nowe obiekty klasy piece, aby wrzycić je do tabeli odzwierciedlającej plansze gry
        const first_piece = new Piece(this.id, this.first_piece_y, this.first_piece_x, this.firstColor, this.position);
        const second_piece = new Piece(this.id, this.second_piece_y, this.second_piece_x, this.secondColor, this.position);
        Board.pixaPush(first_piece, second_piece);
        Board.pixaInsert(this);

        if (Game.isKill([first_piece, second_piece])) {
          document.removeEventListener("keydown", gameActions);
          Game.kill([first_piece, second_piece], Game.checkingFalling);
        } else {
          Game.checkingFalling();
        }
      }
    }
  }
}
