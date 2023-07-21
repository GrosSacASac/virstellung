# Virstellung

A library for server side generated slide show,

if JS in enabled, then the "next" and "previous" links
have the default behaviour
removed and
switch to the next/previous slide without a full page refresh.

The improved select requires `<dialog>` support (progressive enhancement)

## Installation

[`npm i virstellung`](https://www.npmjs.com/package/virstellung)

## Usage

## virstellung.html.js

virstellung is a function that generates html code. This code should be inserted into the `<body>`.
returns a promise

### Example

```js
import { virstellung } from "virstellung";
import mime from "mime"; // not included


const items = [
    "image1.jpg",
    "video.mp4",
];

const mediaFolder = "media";

// must be completely safe to inserted into html
// make sure to validate or escape
// in this example the items are hardcoded so there is no problem
// fileAlone will be passed to getText (if any text is present)
const preparedSlideItems = items.map(item => {
    return {
        label: item,
        url: `./${mediaFolder}/${item}`,
        file: item,
        mime: mime.getType(item),
    }
});

const currentSlideParam = "currentslide";

const generateHref = function (index, item) {
    return `./slide-${index}.html`;
};

const htmlCodeForAllSlides = preparedSlideItems.map((slideItem, i) => {
    return `<!doctype html><html><head>
    <meta name="viewport" content="width=device-width">
    <link media="screen" href="./virstellung.css" rel="stylesheet">
    </head><body>    
    ${await virstellung({
        slideItems: preparedSlideItems, // array with {label, url, mime}
        currentSlide: i, // current slide
        generateHref, // href used in the links for next, previous
        previousLabel: undefined, // optional label string
        nextLabel: undefined, // optional label string
        id: undefined, // id that will be used in the html,
        // for the event handlers to know which slide should go next
        // (there can be multiples slides on the same page)
        //  only required if multiple slides are used
        getText: undefined, // function used to get the text content (server side)
        // may be async
        // needed because there is no native html include yet
        // the text should be html escaped 
    })}
    <script type="module" src="./virstellungAutoLaunch.js"></script>
</body></html>`;
});
```

In the HTTP server, use currentSlideParam queryParameter or the generated Href (see above) to know which html page to serve. (server side rendering)

## virstellungAutoLaunch.js

Optional

Code that should run after the html code generated by the above function. Bundle it with rollup or similar. Import the result as text and serve it inside a `<script type="module">`. This will not work if the html code generated by the above is not found.

Depends upon [dom99](https://www.npmjs.com/package/dom99)

## virstellung.js

Alternative to virstellungAutoLaunch, does nothing by itself, exports a function `stellFir`. Use it with the same id as used before for virstellung function. To improve a select import `augmentSelect` instead

## virstellung.css

Optional

Serve it to inside `<link media="screen" href="./virstellung.css" rel="stylesheet">` in the `<head>`. Again, your server should serve this file.

## Progressive Enhancement

### Multiple Image resolution

If there are multiple resolutions or formats for 1 image you may instead of using url, use a sources array, with object that have url, mime and media (breakpoints).

Make slideItems have items be like :

```js
slideItems = [
{
    label: `flower`,
    mime: `image`,
    sources: [
        {
            url: `./imgfull.jpg`,
            media: `(min-width: 2000px)`,
            mime: `image/jpeg`,
        },
        {
            url: `./goodenough.jpg`,
            media: `(min-width: 1000px)`,
            mime: `image/jpeg`,
        },
        {
            // last should be fallback without media
            url: `./fallback.jpg`,
            mime: `image/jpeg`,
        }
    ]
}
];
```

## selectImage

displays a select with all the images,
if js is enabled and virstellung.js is run with the augmentSelect function then
the select is replaced with a button and a hidden input
the hidden input holds the value and sends it in the form as the select would.
the button is displayed and when clicked opens a dialog to chose an image.
Once chosen the button display and the hidden input value are updated

```js
const [putInsideLabel, putOutsideLabel, putOutsideForm] = selectImage(options, fileSelected=``, multiple=false);

```

The reason it returns 3 pieces of html code is that the slide show container has next and previous interactions that absorbs user input and messes with regular form and is probably invalid html


### Empty option, how to

have an item with value set to empty string, and url point to an image that represents emptyness

## About

Virstellung means presentation in Luxembourgish

### Changelog

[Changelog](./changelog.md)

### License

[CC0](./license.txt)

### Related

- reveal.js
