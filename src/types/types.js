/**
 * @typedef {Object} Choice
 * @property {string} prompt
 * @property {number} next
 *
 * @typedef {Object} TimePoint
 * @property {number} time
 * @property {Choice[]} choices
 *
 * @typedef {Object} Game
 * @property {string} title
 * @property {string} video
 * @property {number} start
 * @property {number} [interval]
 * @property {number} [duration]
 * @property {TimePoint[]} timePoints
 */
