"use strict";
import Board from "./Board.js";
import Game from "./Main.js";
export default class Counters {
  static topScore = document.querySelectorAll(".topScore_element");
  static refreshTopScore() {
    this.topScore.forEach((img) => {
      img.src = `../img/cyfry/0.png`;
    });
    const topScore = localStorage.getItem("highestScore");
    let elementsCounter = this.topScore.length - 1;

    for (let i = topScore.length - 1; i >= 0; i--) {
      this.topScore[elementsCounter].src = `../img/cyfry/${topScore.charAt(i)}.png`;
      elementsCounter--;
    }
  }
  static currentScoreElements = document.querySelectorAll(".currentScore_element");
  static refreshCurrentScore() {
    this.currentScoreElements.forEach((img) => {
      img.src = `../img/cyfry/0.png`;
    });
    const currentScore = `${Game.points}`
    let elementsCounter = this.currentScoreElements.length - 1;
    for (let i = currentScore.length - 1; i >= 0; i--) {
      this.currentScoreElements[elementsCounter].src = `../img/cyfry/${currentScore.charAt(i)}.png`;
      elementsCounter--;
    }
  }
  static virusScoreElements = document.querySelectorAll(".virusScore_element")
  static refreshVirusScore(){
    this.virusScoreElements.forEach((img) => {
        img.src = `../img/cyfry/0.png`;
      });
      const virusNumber = `${Board.viruses.length}`
      let elementsCounter = this.virusScoreElements.length - 1;
      for (let i = virusNumber.length - 1; i >= 0; i--) {

        this.virusScoreElements[elementsCounter].src = `../img/cyfry/${virusNumber.charAt(i)}.png`;
        elementsCounter--;
      }
  }

  static levelScoreElements = document.querySelectorAll(".level_element")
  static refreshLevelScore(){
    this.levelScoreElements.forEach((img) => {
        img.src = `../img/cyfry/0.png`;
      });
      const levelNumber = `${Game.level}`
      let elementsCounter = this.virusScoreElements.length - 1;
      for (let i = levelNumber.length - 1; i >= 0; i--) {

        this.levelScoreElements[elementsCounter].src = `../img/cyfry/${levelNumber.charAt(i)}.png`;
        elementsCounter--;
      }
  }
}
