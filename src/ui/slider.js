import gradient from "ui/gradient";
import marker from "ui/marker";
import hslString from "colorModels/hslString";

/**
  * @constructor slider UI
*/
let slider = function (layers, opts) {
  this._ctx = layers.main.ctx;
  opts.x1 = opts.x;
  opts.y1 = opts.y;
  opts.x2 = opts.x + opts.w;
  opts.y2 = opts.y + opts.h;

  // "range" limits how far the slider's marker can travel, and where it stops and starts along the X axis
  opts.range = {
    min: opts.x + opts.r,
    max: opts.x2 - opts.r,
    w: opts.w - (opts.r * 2)
  };
  opts.sliderType = opts.sliderType || "v";
  this.type = "slider";
  this.marker = new marker(layers.over.ctx, opts.marker);
  this._opts = opts;
};

slider.prototype = {
  /**
    * @desc redraw this UI element
  */
  draw: function (hsv) {
    var ctx = this._ctx;
    var opts = this._opts;
    var x1 = opts.x1,
        y1 = opts.y1,
        x2 = opts.x2,
        y2 = opts.y2,
        w = opts.w,
        h = opts.h,
        r = opts.r,
        border = opts.border,
        borderWidth = border.w;

    // Clear the existing UI
    ctx.clearRect(x1 - borderWidth, y1 - borderWidth, w + (borderWidth * 2), h + (borderWidth * 2));

    // Draw a rounded rect
    // Modified from http://stackoverflow.com/a/7838871
    ctx.beginPath();
    ctx.moveTo(x1 + r, y1);
    ctx.arcTo(x2, y1, x2, y2, r);
    ctx.arcTo(x2, y2, x1, y2, r);
    ctx.arcTo(x1, y2, x1, y1, r);
    ctx.arcTo(x1, y1, x2, y1, r);
    ctx.closePath();

    // I plan to have different slider "types" in the future
    // (I'd like to add a transparency slider at some point, for example)
    var fill;

    // For now the only type is "V", meaning this slider adjusts the HSV V channel
    if (opts.sliderType == "v") {
      fill = gradient.linear(ctx, x1, y1, x2, y2, {
        0: "#000",
        1: hslString.fromHsv({h: hsv.h, s: hsv.s, v: 100}),
      });
    }

    // Draw border
    if (borderWidth) {
      ctx.strokeStyle = border.color;
      ctx.lineWidth = borderWidth * 2;
      ctx.stroke();
    }

    // Draw gradient
    ctx.fillStyle = fill;
    ctx.fill();
  },

  /**
    * @desc updates this element to represent a new color value
    * @param {Object} color - an iroColor object with the new color value
    * @param {Object} changes - an object that gives a boolean for each HSV channel, indicating whether ot not that channel has changed
  */
  update: function (color, changes) {
    var opts = this._opts;
    var range = opts.range;
    var hsv = color.hsv;
    if (opts.sliderType == "v") {
      if (changes.h || changes.s) {
        this.draw(hsv);
      }
      if (changes.v) {
        var percent = (hsv.v / 100);
        this.marker.move(range.min + (percent * range.w), opts.y1 + (opts.h / 2));
      }
    }
  },

  /**
    * @desc Takes a point at (x, y) and returns HSV values based on this input -- use this to update a color from mouse input
    * @param {Number} x - point x coordinate
    * @param {Number} y - point y coordinate
    * @return {Object} - new HSV color values (some channels may be missing)
  */
  input: function (x, y) {
    var opts = this._opts;
    var range = opts.range;
    var dist = Math.max(Math.min(x, range.max), range.min) - range.min;
    return {
      v: Math.round((100 / range.w) * dist),
    };
  },

  /**
    * @desc Check if a point at (x, y) is inside this element
    * @param {Number} x - point x coordinate
    * @param {Number} y - point y coordinate
    * @return {Boolean} - true if the point is a "hit", else false
  */
  checkHit: function (x, y) {
    var opts = this._opts;
    return (x > opts.x1) && (x < opts.x2) && (y > opts.y1) && (y < opts.y2);
  }
};

module.exports = slider;
