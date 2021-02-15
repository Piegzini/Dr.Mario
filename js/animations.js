"use strict";
import Board from "./Board.js";
import { Pixa } from "./Pixa.js";
import { getColors, gameActions } from "./functions.js";
import Game from "./Main.js";

const delay = 20;
export async function animation() {
  const frameOrder = [0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2];
  const amount_of_pixes = Pixa.allPixes.length;
  const current_pixa = Pixa.allPixes[amount_of_pixes - 1];
  const frameParameters = [
    [current_pixa, false, "up", false],
    [current_pixa],
    [current_pixa, false, "up", false],
    [current_pixa],
    [current_pixa, false, "middle", false],
    [current_pixa, true, "midle", false],
    [current_pixa, false, "midle", false],
    [current_pixa, true, "down", false],
    [current_pixa, false, "down", false],
    [current_pixa, true, "down", false],
    [current_pixa, false, "down", false],
    [current_pixa, true, "down", false],
    [current_pixa, false, "down", false],
    [current_pixa, true, "down", false],
    [current_pixa, false, "down", false],
    [current_pixa, true, "down", false],
    [current_pixa, false, "down", false],
    [current_pixa, true, "down", true],
    [current_pixa, false, "down", false],
    [current_pixa, true, "down", false],
    [current_pixa],
  ];

  for (let i = 0; i < frameParameters.length; i++) {
    clearInterval(Game.fall_interval);
    if (i == frameParameters.length - 1) {
      Board.handInsert("up");
      const pixa = new Pixa(Pixa.allPixes.length, getColors());
      Board.pixaInsert(pixa);
      Pixa.allPixes.push(pixa);

      Game.fall_interval = setInterval(() => current_pixa.descent(), 400);
      setTimeout(() => document.addEventListener("keydown", gameActions), 430);
    }
    await framesPromises[frameOrder[i]](frameParameters[i][0], frameParameters[i][1], frameParameters[i][2], frameParameters[i][3]);
  }
}

const framesPromises = [
  (current_pixa, movingLeft, handPosition, descent) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        current_pixa.rotation("left", movingLeft);

        if (descent) current_pixa.descent(false);

        Board.handInsert(handPosition);
        resolve();
      }, delay);
    });
  },
  (current_pixa) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        Board.pixaClear(current_pixa);
        current_pixa.first_piece_y = current_pixa.second_piece_y;
        current_pixa.first_piece_x = current_pixa.second_piece_x - 1;
        [current_pixa.firstColor, current_pixa.secondColor] = [current_pixa.secondColor, current_pixa.firstColor];
        current_pixa.position = "horizontal";
        Board.pixaInsert(current_pixa);
        resolve();
      }, delay);
    });
  },
  (current_pixa) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        current_pixa.descent(false);
        resolve();
      }, delay);
    });
  },
];




