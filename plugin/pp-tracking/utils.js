/**
 * Utility functions for PP Tracking plugin
 */

/**
 * Get slide metadata: slide number
 * @param {HTMLElement} slide - The slide element
 * @returns {number} The slide number
 */
export const getSlideNumber = (slide) => {
  const slideNumber = Reveal.getSlides().indexOf(slide) + 1;
  return slideNumber;
};

/**
 * Determines if the plugin should track total dwell time
 * @param {Object} config - The plugin configuration
 * @returns {boolean} Whether to track total dwell time
 */
export const tracksTotalDwellTime = (config) =>
  config.dwellTimes === true || config.dwellTimes.total;

/**
 * Determines if the plugin should track dwell time per slide
 * @param {Object} config - The plugin configuration
 * @returns {boolean} Whether to track dwell time per slide
 */
export const tracksDwellTimePerSlide = (config) =>
  config.dwellTimes === true || config.dwellTimes.perSlide;

/**
 * Determines if the plugin should track internal link clicks
 * @param {Object} config - The plugin configuration
 * @returns {boolean} Whether to track internal link clicks
 */
export const tracksInternalLinks = (config) =>
  config.links === true || config.links.internal;

/**
 * Determines if the plugin should track external link clicks
 * @param {Object} config - The plugin configuration
 * @returns {boolean} Whether to track external link clicks
 */
export const tracksExternalLinks = (config) =>
  config.links === true || config.links.external;

/**
 * Determines if the plugin should track audio interactions
 * @param {Object} config - The plugin configuration
 * @returns {boolean} Whether to track audio interactions
 */
export const tracksAudio = (config) =>
  config.media === true || config.media.audio;

/**
 * Determines if the plugin should track video interactions
 * @param {Object} config - The plugin configuration
 * @returns {boolean} Whether to track video interactions
 */
export const tracksVideo = (config) =>
  config.media === true || config.media.video;

/**
 * Get all media elements that should be tracked
 * @param {Object} config - The plugin configuration
 * @returns {NodeList} The media elements to track
 */
export const getTrackableMedia = (config) => {
  const mediaSelector = () => {
    if (tracksAudio(config) && tracksVideo(config)) {
      return "audio, video";
    }
    if (tracksAudio(config)) {
      return "audio";
    }
    return "video";
  };

  return document.querySelectorAll(mediaSelector());
};
