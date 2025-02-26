import { tracksTotalDwellTime } from "../utils";

/**
 * Tracks user leaving the presentation and sends data
 * @param {Object} config - The plugin configuration
 * @param {Array} logPresentationViewEvents - Array to store presentation view events
 * @param {Array} logSlideViewEvents - Array to store slide view events
 * @param {Array} logLinkActionEvents - Array to store link action events
 * @param {Array} logMediaActionEvents - Array to store media action events
 * @param {Array} logQuizActionEvents - Array to store quiz action events
 * @param {Timer} globalTimer - Timer for tracking total presentation time
 */
export const trackClosing = (
  config,
  {
    logPresentationViewEvents,
    logSlideViewEvents,
    logLinkActionEvents,
    logMediaActionEvents,
    logQuizActionEvents,
  },
  globalTimer,
) => {
  window.addEventListener("beforeunload", () => {
    const presentationUrl = window.location.href.replace(/(#(.+)?)/, "");

    logPresentationViewEvents.push({
      presentationId: config.apiConfig.presentationId,
      presentationUrl,
      timestamp: new Date().toISOString(),
      finalProgress: Reveal.getProgress(),
      totalDwellTime: tracksTotalDwellTime(config)
        ? globalTimer.getTime()
        : null,
    });

    const payload = {
      logPresentationViewEvents,
      logSlideViewEvents,
      logLinkActionEvents,
      logMediaActionEvents,
      logQuizActionEvents,
    };

    if (config.debug) {
      console.log("🚀 ~ sending events:", payload);
    }

    navigator.sendBeacon(config.apiConfig.trackingAPI, JSON.stringify(payload));
  });
};
