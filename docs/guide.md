## Guide

### Create a Color Picker

To set up a color picker, first we need to make a HTML element to act as a container for it:

```html
<div id="example">
  <!-- The color picker will be inserted here -->
</div>
```

Then we can initialize it with JavaScript, by passing a [CSS selector](https://css-tricks.com/how-css-selectors-work/) for the container element to the `iro.ColorPicker` constructor:

```javascript
var exampleColorPicker = new iro.ColorPicker("#example");
```

### Options

Color pickers can be customized by passing an option object into the second parameter of the `iro.ColorPicker` constructor. All options are, uh, optional:

```javascript
var exampleColorPicker = new iro.ColorPicker("#example", {
  // Canvas dimensions:
  width: 320,
  height: 320,
  // Initial color value -- any hex, rgb or hsl color string works:
  color: "#fff",
  // Radius of the markers that show the current color:
  markerRadius: 8,
  // Padding space around the markers:
  padding: 4,
  // Space between the hue/saturation ring and the value slider:
  sliderMargin: 24,
  // Add a border around the controls:
  borderWidth: 2,
  // Set the border color (defaults to white):
  borderColor: "#000",
  // CSS rules to update as the selected color changes
  css: {
    "body": {
      "background-color": "rgb"
    },
    "input, button": {
      "border-color": "rgb",
      "color": "rgb"
    }
  }
});
```

### Using the Selected Color

#### Getting and Setting the Selected Color

Each color picker instance has a `color` object which - as you might expect - stores current color.

You can get the value of the selected color in a variety of different formats from this object:

```js
// HSV object:
var hsv = exampleColorPicker.color.hsv
//  hsv =  { h: 60, s: 100, v: 100 }

// HSL object:
var hsl = exampleColorPicker.color.hsl;
//  hsl = { h: 60, s: 100, l: 50 }

// RGB object:
var rgb = exampleColorPicker.color.rgb;
//  rgb = { r: 255, g: 255, b: 0 }

// HSL string:
var hslString = exampleColorPicker.color.hslString;
//  hslString = "hsl(60, 100%, 50%)"

// RGB string:
var rgbString = exampleColorPicker.color.rgbString;
//  rgbString = "rgb(255, 250, 0)"

// HEX string:
var hexString = exampleColorPicker.color.hexString;
//  hexString = "#ffff00"
```

All of these properties are also writable. As such, if you set them to a new value, the color picker will update:

```js
// Set the color to red (in rgb notation):
exampleColorPicker.color.rgbString = "rgb(255, 0, 0)";

// Set the color to red (in hex notation):
exampleColorPicker.color.hexString = "#ff0000";

// Set the color to red (in hsv notation, from an object):
exampleColorPicker.color.hsv = { h: 0, s: 100, v: 100 };
```

#### Watching the color for changes

Sometimes you may want to update something whenever a color pickers's selected color is changed. To do this, you can listen for a color wheel's `color:change` event with `on`:

```js
// Create a new function to use for the event handler
// When it is called, it will be passed the color object documented above
function onColorChange(color) {
  // For this example, we'll just log the color's HEX value to the developer console
  console.log(color.hexString);
};

// Watch the color picker using the callback function we just created
exampleColorPicker.on("color:change", onColorChange);
```

There are a couple of other events in addition to the `color:change` event, such as `input:start` and `input:end`. For more information about events, check out the [color picker API docs](https://github.com/jaames/iro.js/blob/master/docs/colorPicker_api.md#on).

### Dynamic CSS

One of Iro's more unique features is its ability to write CSS styles and update them as a color picker's selected color changes. This can be done by using the `css` option when setting up a color picker; just give it an object that represents the CSS selectors and properties that you want to target!

```js
var exampleColorPicker = new iro.ColorPicker("#example", {
  // Other options can go here...
  css: {
    "body": {
      "background-color": "rgb"
    },
    "input, button": {
      "border-color": "rgb",
      "color": "rgb"
    }
  }
});

```

**Note:** You'll see that we're using `"rgb"` for all of the property values here. This indicates that the selected color's RGB value will be used for these properties. At the moment this is the only option, but I intend to provide others as soon as Iro gains transparency support.

Using the example setup above, if the selected color was red (`#f00` in HEX notation) then the CSS output would look like this:

```css
body {
  background-color: #f00;
}

input, button {
  border-color: #f00;
  color: #f00;
}
```
