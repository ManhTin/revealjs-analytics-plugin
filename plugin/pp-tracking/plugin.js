/*!
 * revealjs-pp-tracking plugin v1.0.0
 * Manh Tin Nguyen
 * MIT licensed
 *
 * Copyright (C) 2025 Manh Tin Nguyen
 */

import { Timer } from "./timer";

const Plugin = () => {
  const defaultConfig = {
    apiConfig: {},
    dwellTimes: true,
    links: true,
    media: true,
    slideTransitions: true,
    revealDependencies: {
      quiz: false,
    },
    debug: false,
  };

  const config = { ...defaultConfig, ...Reveal.getConfig().ppTracking };

  const logPresentationViewEvents = [];
  const logSlideViewEvents = [];
  const logLinkActionEvents = [];
  const logMediaActionEvents = [];
  const logQuizActionEvents = [];

  const LinkTypes = {
    INTERNAL: "INTERNAL",
    EXTERNAL: "EXTERNAL",
  };

  const MediaTypes = {
    AUDIO: "AUDIO",
    VIDEO: "VIDEO",
  };

  const MediaEventTypes = {
    PLAY: "PLAY",
    PAUSE: "PAUSE",
  };

  const QuizEventTypes = {
    START: "START",
    COMPLETE: "COMPLETE",
  };

  /**
   * Validate API configuration for tracking plug-in.
   */
  if (config.apiConfig.trackingAPI === undefined) {
    console.error(
      "You have no trackingAPI configured where to send tracking data to!",
    );
    return;
  }

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
  const PRESENTATION_URL = LOCATION.href.replace(/(#(.+)?)/, "");

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
    events.push({
      presentationId: config.apiConfig.presentationId,
      ...payload,
      timestamp: new Date().toISOString(),
      url: PRESENTATION_URL,
    });
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
          slideNumber: _slideData(event.currentSlide),
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
        if (!event.previousSlide) return;

        logSlideViewEvents.push({
          presentationId: config.apiConfig.presentationId,
          presentationUrl: PRESENTATION_URL,
          timestamp: new Date().toISOString(),
          slideNumber: _slideData(event.previousSlide),
          dwellTime: slideTimer.getTime(),
        });

        slideTimer.reset();
      });
    }
  }

  function _sentData() {
    const payload = {
      logPresentationViewEvents: logPresentationViewEvents,
      logSlideViewEvents: logSlideViewEvents,
      logLinkActionEvents: logLinkActionEvents,
      logMediaActionEvents: logMediaActionEvents,
      logQuizActionEvents: logQuizActionEvents,
    };

    if (config.debug) {
      console.log("🚀 ~ sending events");
    }

    navigator.sendBeacon(config.apiConfig.trackingAPI, JSON.stringify(payload));
  }

  /**
   * Track last dwell time per slide and total dwell time.
   * Also send data to trackingAPI.
   */
  function _trackClosing() {
    window.addEventListener("beforeunload", () => {
      const currentSlide = Reveal.getCurrentSlide();

      logPresentationViewEvents.push({
        presentationId: config.apiConfig.presentationId,
        presentationUrl: PRESENTATION_URL,
        timestamp: new Date().toISOString(),
        finalProgress: Reveal.getProgress(),
        totalDwellTime: _tracksTotalDwellTime() ? globalTimer.getTime() : null,
      });

      _sentData();
    });
  }

  /**
   * Track clicks on links.
   */
  function _trackLinks() {
    if (_tracksInternalLinks() || _tracksExternalLinks()) {
      document.addEventListener("click", (event) => {
        if (
          !Array.from(Reveal.getCurrentSlide().querySelectorAll("a")).includes(
            event.target,
          )
        ) return true;

        const baseURL = window.location.href.replace(
          new RegExp(window.location.hash) || "",
          "",
        );
        const path = event.target.href.replace(baseURL, "");

        const isInternalLink = path.startsWith("#");

        if (
          (isInternalLink && _tracksInternalLinks()) ||
          (!isInternalLink && _tracksExternalLinks())
        ) {
          const linkType = isInternalLink
            ? LinkTypes.INTERNAL
            : LinkTypes.EXTERNAL;
          const href = isInternalLink ? path : event.target.href;
          const currentSlide = Reveal.getCurrentSlide();

          logLinkActionEvents.push({
            presentationId: config.apiConfig.presentationId,
            presentationUrl: PRESENTATION_URL,
            timestamp: new Date().toISOString(),
            slideNumber: _slideData(currentSlide),
            linkType: linkType,
            linkUrl: href,
            linkText: event.target.text.trim(),
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

          const mediaMetadata = {
            mediaId: media.id,
            mediaType:
              media.tagName === "AUDIO" ? MediaTypes.AUDIO : MediaTypes.VIDEO,
            presentationId: config.apiConfig.presentationId,
            presentationUrl: PRESENTATION_URL,
          };

          if (!media.onplay) {
            media.onplay = function () {
              logMediaActionEvents.push({
                timestamp: new Date().toISOString(),
                actionType: MediaEventTypes.PLAY,
                slideNumber: _slideData(currentSlide),
                mediaSource: this.currentSrc,
                currentTime: Number.parseInt(this.currentTime),
                totalDuration: Number.parseInt(this.duration),
                ...mediaMetadata,
              });
              console.log(
                "🚀 ~ trackMediaEvents ~ logMediaActionEvents:",
                logMediaActionEvents,
              );
            };
          }

          if (!media.onpause) {
            media.onpause = function () {
              logMediaActionEvents.push({
                timestamp: new Date().toISOString(),
                actionType: MediaEventTypes.PAUSE,
                slideNumber: _slideData(currentSlide),
                mediaSource: this.currentSrc,
                currentTime: Number.parseInt(this.currentTime),
                totalDuration: Number.parseInt(this.duration),
                progress: this.currentTime / this.duration,
                finished: this.ended,
                ...mediaMetadata,
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
        const currentSlide = Reveal.getCurrentSlide();
        const quizName = currentSlide.querySelector("[data-quiz]").dataset.quiz;
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
          quizId: quizName,
          quizName: quiz.info.name,
          numberOfQuestions: quiz.questions.length,
          presentationId: config.apiConfig.presentationId,
          presentationUrl: PRESENTATION_URL,
        };

        logQuizActionEvents.push({
          timestamp: new Date().toISOString(),
          slideNumber: _slideData(currentSlide),
          actionType: QuizEventTypes.START,
          ...quizMetadata,
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
          dwellTime = quizTimers[quizName].getTime();
          quizTimers[quizName].clear();
        }

        const quizMetadata = {
          quizId: quizName,
          quizName: quiz.info.name,
          numberOfQuestions: quiz.questions.length,
        };

        logQuizActionEvents.push({
          timestamp: new Date().toISOString(),
          actionType: QuizEventTypes.COMPLETE,
          slideNumber: _slideData(Reveal.getCurrentSlide()),
          dwellTime: dwellTime,
          completed: true,
          score: options.score,
          ...quizMetadata,
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
    _trackDwellTimes();
    _trackClosing();
    _trackLinks();
    _trackMediaActions();
    _trackQuizzes();
  }

  return {
    id: "pp-tracking",
    init: (reveal) => {
      const config = reveal.getConfig();
      addEventListeners();
      startTimers();
      // TODO remove
      if (config.ppTracking.debug) {
        console.log("Initialized pp-tracking plugin");
        console.log("Plugin Config:", config.ppTracking);
      }
    },
  };
};

export default Plugin;
