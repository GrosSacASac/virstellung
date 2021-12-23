// globals slideItems , currentSlide
import * as d from "dom99";
import { move } from "dom99/plugins/move/move.js";


d.plugin(move);

let { currentSlide } = window;
const initialTitle = document.title;

const previousSlide = function (event) {
    if (event && event.preventDefault) {
        event.preventDefault();
    }
    currentSlide = currentSlide - 1;
    if (currentSlide === -1) {
        currentSlide = slideItems.length - 1;
    }
    displayX(currentSlide);
};

const nextSlide = function (event) {
    if (event && event.preventDefault) {
        event.preventDefault();
    }
    currentSlide = (currentSlide + 1) % slideItems.length;
    displayX(currentSlide);
    preloadX((currentSlide + 1) % slideItems.length);
};

const preloadX = function (slide) {
    // only preload images
    const { file, mime } = slideItems[slide];
    if (mime.includes(`image`)) {
        d.elements.preloader.src = file;
    }
};

const displayX = function (currentSlide) {
    const { file, mime, label } = slideItems[currentSlide];
    document.title = `${initialTitle} ${label}`;
    d.elements.image.hidden = true;
    d.elements.video.hidden = true;
    d.elements.audio.hidden = true;
    if (mime.includes(`image`)) {
        d.elements.image.alt = label;
        d.elements.image.hidden = false;
        d.elements.image.src = file;
        d.elements.video.pause();
        d.elements.audio.pause();
    } else if (mime.includes(`video`)) {
        d.elements.video.hidden = false;
        d.elements.video.src = file;
        d.elements.video.type = mime;
        d.elements.audio.pause();
    } else if (mime.includes(`audio`)) {
        d.elements.audio.hidden = false;
        d.elements.audio.src = file;
        d.elements.audio.type = mime;
        d.elements.video.pause();
    }
    if (navigator.mediaSession) {
        navigator.mediaSession.metadata = new MediaMetadata({
            title: file,
        });
    }
};


d.start({
    dataFunctions: {
        next: nextSlide,
        previous: previousSlide,
    },
});
d.elements.audio.addEventListener(`ended`, function () {
    if (d.elements.audio.loop) {
        return;
    }
    nextSlide();
});
d.elements.audio.volume = 0.5;
d.elements.video.volume = 0.5;

const actionHandlers = [
    // play
    [
        `nexttrack`,
        function () {
            nextSlide();
        },
    ],
    [
        `previoustrack`,
        () => {
            previousSlide();
        },
    ],
];

for (const [action, handler] of actionHandlers) {
    try {
        navigator.mediaSession.setActionHandler(action, handler);
    } catch (error) {
        //
    }
}
