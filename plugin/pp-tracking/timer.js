/*!
 * revealjs-pp-tracking plugin v1.0.0
 * Manh Tin Nguyen
 * MIT licensed
 *
 * Copyright (C) 2025 Manh Tin Nguyen
 */

/**
 * A basic Timer class to capture dwell times.
 */
export class Timer {
  constructor() {
    this.hours = 0;
    this.minutes = 0;
    this.seconds = 0;
  }

  start() {
    if (this.timer) {
      console.log("The timer is already running.");
    } else {
      this.timer = setInterval(() => {
        this._incrementSecond();
      }, 1000);
    }
  }

  reset() {
    this.clear();
    this.start();
  }

  clear() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = undefined;
    }
    this.hours = 0;
    this.minutes = 0;
    this.seconds = 0;
  }

  toString() {
    const hourString = this.hours > 9 ? this.hours : `0${this.hours}`;
    const minuteString = this.minutes > 9 ? this.minutes : `0${this.minutes}`;
    const secondString = this.seconds > 9 ? this.seconds : `0${this.seconds}`;

    return `${hourString}:${minuteString}:${secondString}`;
  }

  _incrementSecond() {
    this.seconds++;
    if (this.seconds >= 60) {
      this.seconds = 0;
      this.minutes++;
      if (this.minutes >= 60) {
        this.minutes = 0;
        this.hours++;
      }
    }
  }
}
