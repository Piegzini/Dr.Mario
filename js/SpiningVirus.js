"use strict";

import Board from "./Board.js";
import Game from "./Main.js";

export class SpiningVirus {
  static all = {
    yl: null,
    bl: null,
    br: null,
  };
  static circleAnimationInterval;
  static counterFrames = 0;
  constructor(element, color) {
    this.element = element;
    this.color = color;
    this.frame = 1;
    this.animationInterval = 0;
    this.lives = true;

  }

  animation = () => {
    if (Game.result === "during" && Board.countOfViruses[this.color] !== 0 && this.lives === true) {
      this.frame = this.frame > 4 ? 1 : this.frame;
      this.element.style.backgroundImage = `url(../img/lupa/${this.color}/${this.frame}.png)`;
      this.frame++;
    } else if (Game.result === "loss" && Board.countOfViruses[this.color] !== 0 && this.lives === true) {
      this.frame = this.frame > 4 ? 2 : this.frame;
      this.element.style.backgroundImage = `url(../img/lupa/${this.color}/${this.frame}.png)`;
      this.frame += 2;
    } else if (this.lives === false) {
      this.frame = this.frame > 2 ? 1 : this.frame;
      this.element.style.backgroundImage = `url(../img/lupa/${this.color}/${this.frame}_dead.png)`;
      this.frame += 1;
      if (Board.countOfViruses[this.color] === 0) {
        setTimeout(() => {
          clearInterval(this.animationInterval)
          this.element.style.backgroundImage = `url()`;
        }, 800);
      }
      else if(Board.countOfViruses[this.color] > 0){
        setTimeout(() => {
          this.lives = true
        }, 800);
      }
    }
  };

  static stopAnimation = () => {
    SpiningVirus.all.forEach((element) => {
      clearInterval(element.animationInterval);
    });
  };
}

SpiningVirus.circleAnimationInterval = setInterval(async function () {
  SpiningVirus.counterFrames = SpiningVirus.counterFrames >= virusesFrames.length ? 0 : SpiningVirus.counterFrames;
  await animateViruses(SpiningVirus.counterFrames);
  SpiningVirus.counterFrames++;
}, 1000);

async function animateViruses(counter) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const currentGame = Game.all[Game.all.length - 1];
      currentGame.brownVirus.style.top = virusesFrames[counter].br.top + "px";
      currentGame.brownVirus.style.left = virusesFrames[counter].br.left + "px";
      currentGame.blueVirus.style.top = virusesFrames[counter].bl.top + "px";
      currentGame.blueVirus.style.left = virusesFrames[counter].bl.left + "px";
      currentGame.yellowVirus.style.top = virusesFrames[counter].yl.top + "px";
      currentGame.yellowVirus.style.left = virusesFrames[counter].yl.left + "px";
      resolve();
    }, 40);
  });
}

const virusesFrames = [
  { br: { top: 40, left: 30 }, yl: { top: 120, left: 60 }, bl: { top: 60, left: 105 } },
  { br: { top: 55, left: 15 }, yl: { top: 110, left: 75 }, bl: { top: 45, left: 95 } },
  { br: { top: 70, left: 10 }, yl: { top: 100, left: 85 }, bl: { top: 35, left: 90 } },
  { br: { top: 85, left: 17 }, yl: { top: 90, left: 96 }, bl: { top: 20, left: 70 } },
  { br: { top: 105, left: 30 }, yl: { top: 75, left: 105 }, bl: { top: 20, left: 50 } },

  { br: { top: 120, left: 60 }, yl: { top: 60, left: 105 }, bl: { top: 40, left: 30 } },
  { br: { top: 110, left: 75 }, yl: { top: 45, left: 95 }, bl: { top: 55, left: 15 } },
  { br: { top: 100, left: 85 }, yl: { top: 35, left: 90 }, bl: { top: 70, left: 10 } },
  { br: { top: 90, left: 96 }, yl: { top: 20, left: 70 }, bl: { top: 85, left: 17 } },
  { br: { top: 75, left: 105 }, yl: { top: 20, left: 50 }, bl: { top: 105, left: 30 } },

  { br: { top: 60, left: 105 }, yl: { top: 40, left: 30 }, bl: { top: 120, left: 60 } },
  { br: { top: 45, left: 95 }, yl: { top: 55, left: 15 }, bl: { top: 110, left: 75 } },
  { br: { top: 35, left: 90 }, yl: { top: 70, left: 10 }, bl: { top: 100, left: 85 } },
  { br: { top: 20, left: 70 }, yl: { top: 85, left: 17 }, bl: { top: 90, left: 96 } },
  { br: { top: 20, left: 50 }, yl: { top: 105, left: 30 }, bl: { top: 75, left: 105 } },
];
