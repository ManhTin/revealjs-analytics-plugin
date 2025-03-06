/*!
 * reveal-analytics plugin v1.0.0
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
    this.seconds = 0;
  }

  start() {
    if (this.timer) {
      console.log("The timer is already running.");
    } else {
      this.timer = setInterval(() => {
        this.seconds++;
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
    this.seconds = 0;
  }

  getTime() {
    return this.seconds;
  }

  toString() {
    const hours = Math.floor(this.seconds / 3600);
    const minutes = Math.floor((this.seconds % 3600) / 60);
    const seconds = this.seconds % 60;

    const hourString = hours > 9 ? hours : `0${hours}`;
    const minuteString = minutes > 9 ? minutes : `0${minutes}`;
    const secondString = seconds > 9 ? seconds : `0${seconds}`;

    return `${hourString}:${minuteString}:${secondString}`;
  }
}
