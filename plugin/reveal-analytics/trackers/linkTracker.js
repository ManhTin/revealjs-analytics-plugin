import { LinkTypes } from "../constants";
import {
  getSlideNumber,
  tracksExternalLinks,
  tracksInternalLinks,
} from "../utils";

/**
 * Tracks clicks on links
 * @param {Object} config - The plugin configuration
 * @param {Array} logLinkActionEvents - Array to store link action events
 */
export const trackLinks = (config, logLinkActionEvents) => {
  if (!tracksInternalLinks(config) && !tracksExternalLinks(config)) return;

  document.addEventListener("click", (event) => {
    const currentSlide = Reveal.getCurrentSlide();
    const links = Array.from(currentSlide.querySelectorAll("a"));

    if (!links.includes(event.target)) return;

    const baseURL = window.location.href.replace(
      new RegExp(window.location.hash) || "",
      "",
    );
    const path = event.target.href.replace(baseURL, "");

    const isInternalLink = path.startsWith("#");

    if (
      (isInternalLink && tracksInternalLinks(config)) ||
      (!isInternalLink && tracksExternalLinks(config))
    ) {
      const linkType = isInternalLink ? LinkTypes.INTERNAL : LinkTypes.EXTERNAL;
      const href = isInternalLink ? path : event.target.href;

      logLinkActionEvents.push({
        presentationId: config.apiConfig.presentationId,
        presentationUrl: window.location.href.replace(/(#(.+)?)/, ""),
        timestamp: new Date().toISOString(),
        slideNumber: getSlideNumber(currentSlide),
        linkType,
        linkUrl: href,
        linkText: event.target.text.trim(),
      });
      console.log("logLinkActionEvent", logLinkActionEvents.slice(-1)[0]);
    }
  });
};
