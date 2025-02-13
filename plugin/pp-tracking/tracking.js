/*!
 * reveal.js-tracking plugin v1.0.0
 * Manh Tin Nguyen
 * MIT licensed
 *
 * Copyright (C) 2025 Manh Tin Nguyen
 */

/**
 * A basic Timer class to capture dwell times.
 */
class Timer {
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

/**
 * RevealPPTracking
 * A reveal.js plugin to track events
 */

const RevealPPTracking =
  window.RevealPPTracking ||
  (() => {
    const defaultConfig = {
      apiConfig: {},
      dwellTimes: true,
      links: true,
      media: true,
      slideTransitions: true,
      revealDependencies: {
        quiz: false,
      },
    };

    // overwrite default config with manual config
    // const config = {...defaultConfig, ...Reveal.getConfig().tracking};
    const config = { ...defaultConfig };

    /**
     * Validate API configuration for tracking plug-in.
     */
    // if (config.apiConfig.trackingAPI == undefined) {
    //   console.error('You have no trackingAPI configured where to send tracking data to!');
    //   return;
    // }

    /**
     * Returns whether the tracking plug-in is allowed
     * to track the total dwell time.
     */
    function _tracksTotalDwellTime() {
      return config.dwellTimes === true || config.dwellTimes.total;
    }

    /**
     * Returns whether the tracking plug-in is allowed
     * to track the dwell time per slide.
     */
    function _tracksDwellTimePerSlide() {
      return config.dwellTimes === true || config.dwellTimes.perSlide;
    }

    /**
     * Returns whether the tracking plug-in is allowed
     * to track internal link clicks.
     */
    function _tracksInternalLinks() {
      return config.links === true || config.links.internal;
    }

    /**
     * Returns whether the tracking plug-in is allowed
     * to track external link clicks.
     */
    function _tracksExternalLinks() {
      return config.links === true || config.links.external;
    }

    /**
     * Returns whether the tracking plug-in is allowed
     * to track audio interactions.
     */
    function _tracksAudio() {
      return config.media === true || config.media.audio;
    }

    /**
     * Returns whether the tracking plug-in is allowed
     * to track video interactions.
     */
    function _tracksVideo() {
      return config.media === true || config.media.video;
    }

    const LOCATION = window.location;
    const PRESENTATION = LOCATION.href.replace(/(#(.+)?)/, "");
    const DOCUMENT = window.document;

    const TRACKED_REVEAL_EVENTS = ["slidechanged", "ready"];

    const globalTimer = new Timer();
    const slideTimer = new Timer();
    const quizTimers = {};

    // #### Helper Functions ####

    /**
     * Get slide metadata: slide number, and indices.
     */
    function _slideData(slide) {
      const indices = Reveal.getIndices(slide);
      const slideNumber = Reveal.getSlides().indexOf(slide) + 1;

      // return {
      //   slideNumber: slideNumber,
      //   horizontalIndex: indices.h,
      //   verticalIndex: indices.v || 0,
      // };

      return slideNumber;
    }

    /**
     * Get all media
     */
    function _getMedia() {
      function _mediaSelector() {
        if (_tracksAudio() && _tracksVideo()) {
          return "audio, video";
        }
        if (_tracksAudio()) {
          return "audio";
        }
        return "video";
      }

      return document.querySelectorAll(_mediaSelector());
    }

    // #### Tracking ####

    function _track(payload) {
      console.log({
        ...payload,
        timestamp: new Date().toISOString(),
        url: PRESENTATION,
      });

      // navigator.sendBeacon('https://fed38cb3-b44d-4e6c-9b62-a90245800532.mock.pstmn.io/api/track_event', JSON.stringify({
      //   ...payload,
      //   timestamp: new Date().toISOString(),
      //   url: PRESENTATION,
      // }))
    }

    /**
     * Track reveal.js events
     */
    function _trackRevealEvents() {
      for (const eventName of TRACKED_REVEAL_EVENTS) {
        Reveal.addEventListener(eventName, (event) => {
          if (eventName === "slidechanged" && !event.previousSlide) return;

          const payload = {
            eventName: eventName,
            slide: _slideData(event.currentSlide),
          };

          _track(payload);
        });
      }
    }

    /**
     * Track dwell time per slide.
     */
    function _trackDwellTimes() {
      if (_tracksDwellTimePerSlide()) {
        Reveal.addEventListener("slidechanged", (event) => {
          console.log("🚀 ~ Reveal.addEventListener ~ event:", event);
          if (!event.previousSlide) return;

          _track({
            eventName: "dwellTimePerSlide",
            slide: _slideData(event.previousSlide),
            data: { dwellTime: slideTimer.toString() },
          });

          slideTimer.reset();
        });
      }
    }

    /**
     * Track last dwell time per slide and total dwell time.
     * Also send data to trackingAPI.
     */
    function _trackClosing() {
      window.addEventListener("beforeunload", () => {
        const currentSlide = Reveal.getCurrentSlide();

        _track({
          eventName: "end",
          slide: _slideData(currentSlide),
          data: {
            finalProgress: Reveal.getProgress(),
            dwellTime: _tracksDwellTimePerSlide()
              ? slideTimer.toString()
              : null,
            totalDwellTime: _tracksTotalDwellTime()
              ? globalTimer.toString()
              : null,
          },
        });
      });
    }

    /**
     * Track clicks on links.
     */
    function _trackLinks() {
      if (_tracksInternalLinks() || _tracksExternalLinks()) {
        document.addEventListener("click", (event) => {
          if (
            !Array.from(
              Reveal.getCurrentSlide().querySelectorAll("a"),
            ).includes(event.target)
          )
            return true;
          const baseURL = window.location.href.replace(
            new RegExp(window.location.hash) || "",
            "",
          );
          const path = event.target.href.replace(baseURL, "");

          if (path === "#") return true;

          const isInternalLink = path.startsWith("#");

          if (
            (isInternalLink && _tracksInternalLinks()) ||
            (!isInternalLink && _tracksExternalLinks())
          ) {
            const linkType = isInternalLink ? "internalLink" : "externalLink";
            const href = isInternalLink ? path : event.target.href;
            const currentSlide = Reveal.getCurrentSlide();

            _track({
              eventName: "linkClick",
              slide: _slideData(currentSlide),
              data: {
                linkType: linkType,
                href: href,
                linkText: event.target.text.trim(),
              },
            });
          }
        });
      }
    }

    /**
     * Track audio and video (play, pause, progress).
     */
    function _trackMediaActions() {
      if (_tracksAudio() || _tracksVideo()) {
        function trackMediaEvents() {
          const mediaElements = _getMedia();
          for (const media of mediaElements) {
            const currentSlide = Reveal.getCurrentSlide();
            const mediaType = media.tagName.toLowerCase();

            if (!media.onplay) {
              media.onplay = function () {
                _track({
                  eventName: `${mediaType}_play`,
                  slide: _slideData(currentSlide),
                  data: {
                    id: this.id,
                    mediaSource: this.currentSrc,
                    currentTime: this.currentTime,
                    duration: this.duration,
                  },
                });
              };
            }

            if (!media.onpause) {
              media.onpause = function () {
                _track({
                  eventName: `${mediaType}_pause`,
                  slide: _slideData(currentSlide),
                  data: {
                    id: this.id,
                    mediaSource: this.currentSrc,
                    finished: this.ended,
                    progress: this.currentTime / this.duration,
                    currentTime: this.currentTime,
                    duration: this.duration,
                  },
                });
              };
            }
          }
        }

        Reveal.addEventListener("ready", trackMediaEvents);
        Reveal.addEventListener("fragmentshown", trackMediaEvents);
        Reveal.addEventListener("fragmenthidden", trackMediaEvents);
        Reveal.addEventListener("slidechanged", trackMediaEvents);
      }
    }

    /**
     * Track quizzes from plug-in
     * [reveal.js-quiz](https://gitlab.com/schaepermeier/reveal.js-quiz).
     * Includes score, and whether they were started and completed.
     */
    function _trackQuizzes() {
      if (config.revealDependencies.quiz) {
        const quizConfig = Reveal.getConfig().quiz || {};
        quizConfig.events = quizConfig.events || {};

        function trackQuizStart() {
          const quizName =
            Reveal.getCurrentSlide().querySelector("[data-quiz]").dataset.quiz;
          if (!quizName) return true;

          const quiz = window[quizName];
          if (!quiz) return true;

          if (quizTimers[quizName] instanceof Timer) {
            quizTimers[quizName].reset();
          } else {
            quizTimers[quizName] = new Timer();
            quizTimers[quizName].start();
          }

          const quizMetadata = {
            id: quizName,
            name: quiz.info.name,
            topic: quiz.info.main,
            numberOfQuestions: quiz.questions.length,
          };

          _track("quiz", {
            quizEvent: "start",
            timestamp: globalTimer.toString(),
            metadata: quizMetadata,
          });
        }

        function trackQuizComplete(options) {
          const quizName =
            Reveal.getCurrentSlide().querySelector("[data-quiz]").dataset.quiz;
          if (!quizName) return true;

          const quiz = window[quizName];
          if (!quiz) return true;

          let dwellTime;
          if (quizTimers[quizName] instanceof Timer) {
            dwellTime = quizTimers[quizName].toString();
            quizTimers[quizName].clear();
          }

          const quizMetadata = {
            id: quizName,
            name: quiz.info.name,
            topic: quiz.info.main,
            numberOfQuestions: quiz.questions.length,
          };

          _track("quiz", {
            quizEvent: "complete",
            dwellTime: dwellTime,
            completed: true,
            score: options.score,
            timestamp: globalTimer.toString(),
            metadata: quizMetadata,
          });
        }

        if (quizConfig.events.onStartQuiz) {
          const existingCallback = quizConfig.events.onStartQuiz;
          quizConfig.events.onStartQuiz = () => {
            trackQuizStart();
            existingCallback();
          };
        } else {
          quizConfig.events.onStartQuiz = () => {
            trackQuizStart();
          };
        }

        if (quizConfig.events.onCompleteQuiz) {
          const existingCallback = quizConfig.events.onCompleteQuiz;
          quizConfig.events.onCompleteQuiz = (options) => {
            trackQuizComplete(options);
            existingCallback(options);
          };
        } else {
          quizConfig.events.onCompleteQuiz = (options) => {
            trackQuizComplete(options);
          };
        }

        // initialize the quizzes
        prepareQuizzes(quizConfig);
      }
    }

    // #### Main Logic ####

    /**
     * Start all necessary timers.
     */
    function startTimers() {
      if (_tracksDwellTimePerSlide()) {
        globalTimer.start();
        slideTimer.start();
      } else {
        globalTimer.start();
      }
    }

    /**
     * Add all event listeners for tracking.
     */
    function addEventListeners() {
      _trackRevealEvents();
      _trackDwellTimes();
      _trackClosing();
      _trackLinks();
      _trackMediaActions();
      _trackQuizzes();
      console.log("🚀 ~ addEventListeners");
    }

    return {
      id: "tracking",
      init: (deck) => {
        addEventListeners();
        startTimers();
        console.log("It works!!! 🍻");
      },
    };
  })();
