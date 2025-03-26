/**
 * Manages the opt-out functionality for tracking
 */
export class OptOutManager {
  constructor(config = {}) {
    this.config = {
      popupDelay: 1000, // ms to wait before showing popup
      ...config,
    };
    this.popup = null;
    this.trackingAllowed = true; // Default to allow tracking
    this.initialized = false;
  }

  /**
   * Initialize the opt-out manager
   * @returns {boolean} Whether tracking is allowed
   */
  init() {
    if (this.initialized) return this.trackingAllowed;

    setTimeout(() => this.showPopup(), this.config.popupDelay);

    this.initialized = true;
    return this.trackingAllowed;
  }

  /**
   * Create and show the opt-out popup
   */
  showPopup() {
    this.popup = document.createElement("div");
    this.popup.className = "reveal-analytics-popup";

    this.popup.innerHTML = `
      <span class="reveal-tracking-close">&times;</span>
      <p>This presentation uses analytics to improve content. No personal data is collected.</p>
      <div class="reveal-analytics-buttons">
        <button class="reveal-analytics-btn reveal-tracking-decline">Opt Out</button>
        <button class="reveal-analytics-btn reveal-tracking-accept">Accept</button>
      </div>
    `;

    this.popup
      .querySelector(".reveal-tracking-close")
      .addEventListener("click", () => {
        this.acceptTracking();
      });

    this.popup
      .querySelector(".reveal-tracking-accept")
      .addEventListener("click", () => {
        this.acceptTracking();
      });

    this.popup
      .querySelector(".reveal-tracking-decline")
      .addEventListener("click", () => {
        console.log("Opting out of tracking");
        this.optOut();
      });

    document.body.appendChild(this.popup);
  }

  /**
   * Accept tracking and close popup
   */
  acceptTracking() {
    this.trackingAllowed = true;
    this.closePopup();
  }

  /**
   * Opt out of tracking and close popup
   */
  optOut() {
    this.trackingAllowed = false;
    this.closePopup();
  }

  /**
   * Close and remove the popup
   */
  closePopup() {
    if (this.popup?.parentNode) {
      this.popup.parentNode.removeChild(this.popup);
      this.popup = null;
    }
  }

  /**
   * Check if tracking is allowed
   * @returns {boolean} Whether tracking is allowed
   */
  isTrackingAllowed() {
    return this.trackingAllowed;
  }
}
