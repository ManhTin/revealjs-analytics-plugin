/*!
 * revealjs-pp-tracking plugin v1.0.0
 * Manh Tin Nguyen
 * MIT licensed
 *
 * Copyright (C) 2025 Manh Tin Nguyen
 */

import { DEFAULT_CONFIG } from "./constants";
import { Timer } from "./timer";
import {
  trackClosing,
  trackDwellTimes,
  trackLinks,
  trackMediaActions,
  trackQuizzes,
  trackStart,
} from "./trackers";
import { tracksDwellTimePerSlide, tracksTotalDwellTime } from "./utils";

/**
 * PP Tracking Plugin for reveal.js
 * Tracks user interactions with presentation
 */
const Plugin = () => {
  // Merge default config with user config
  const config = { ...DEFAULT_CONFIG, ...Reveal.getConfig().ppTracking };

  // Event logging arrays
  const eventLogs = {
    logPresentationStartEvents: [],
    logPresentationCloseEvents: [],
    logSlideViewEvents: [],
    logLinkActionEvents: [],
    logMediaActionEvents: [],
    logQuizActionEvents: [],
  };

  // Validate API configuration
  if (!config.apiConfig.trackingAPI) {
    console.error(
      "You have no trackingAPI configured where to send tracking data to!",
    );
    return null;
  }

  // Initialize timers
  const globalTimer = new Timer();
  const slideTimer = new Timer();

  /**
   * Starts all necessary timers based on configuration
   */
  const startTimers = () => {
    globalTimer.start();

    if (tracksDwellTimePerSlide(config)) {
      slideTimer.start();
    }
  };

  /**
   * Adds all event listeners for tracking
   */
  const addEventListeners = () => {
    // Track presentation start
    trackStart(config, eventLogs.logPresentationStartEvents);

    // Track dwell times
    trackDwellTimes(config, eventLogs.logSlideViewEvents, slideTimer);

    // Track user leaving presentation
    trackClosing(config, eventLogs, globalTimer);

    // Track links
    trackLinks(config, eventLogs.logLinkActionEvents);

    // Track media interactions
    trackMediaActions(config, eventLogs.logMediaActionEvents);

    // Track quiz interactions
    trackQuizzes(config, eventLogs.logQuizActionEvents);
  };

  return {
    id: "pp-tracking",
    init: () => {
      addEventListeners();
      startTimers();

      if (config.debug) {
        console.log("Initialized pp-tracking plugin");
        console.log("Plugin Config:", config);
      }
    },
  };
};

export default Plugin;
