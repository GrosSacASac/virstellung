// globals slideItems , currentSlide
export {stellFir};

import * as d from "dom99";
import { move } from "dom99/plugins/move/move.js";


d.plugin(move);
window.d = d;
let { currentSlide } = window; // todo
const initialTitle = document.title;

const virstellungPrevious = function (event) {
    event?.preventDefault?.();

    currentSlide = currentSlide - 1;
    if (currentSlide === -1) {
        currentSlide = slideItems.length - 1;
    }
    displayX(currentSlide, d.scopeFromEvent(event));
};

const virstellungNext = function (event) {
    event?.preventDefault?.();

    currentSlide = (currentSlide + 1) % slideItems.length;
    displayX(currentSlide, d.scopeFromEvent(event));
    preloadX((currentSlide + 1) % slideItems.length, d.scopeFromEvent(event));
};

const preloadX = function (slide, scope) {
    // only preload images
    const { file, mime } = slideItems[slide];
    if (mime.includes(`image`)) {
        d.elements.preloader.src = file;
    }
};

const displayX = function (currentSlide, scope) {
    const { file, mime, label } = slideItems[currentSlide];
    document.title = `${initialTitle} ${label}`;
    const {image, video, audio} = d.elements[d.scopeFromArray([scope, "image"])];
    image.hidden = true;
    video.hidden = true;
    audio.hidden = true;
    if (mime.includes(`image`)) {
        image.alt = label;
        image.hidden = false;
        image.src = file;
        video.pause();
        audio.pause();
    } else if (mime.includes(`video`)) {
        video.hidden = false;
        video.src = file;
        video.type = mime;
        audio.pause();
    } else if (mime.includes(`audio`)) {
        audio.hidden = false;
        audio.src = file;
        audio.type = mime;
        video.pause();
    }
    if (navigator.mediaSession) {
        navigator.mediaSession.metadata = new MediaMetadata({
            title: file,
        });
    }
};

const stellFir = (id=``) => {
    d.start({
        dataFunctions: {
            virstellungNext,
            virstellungPrevious,
        },
    });
    
    d.elements[d.scopeFromArray([id, "audio"])].volume = 0.5;
    d.elements[d.scopeFromArray([id, "video"])].volume = 0.5;

}

try {
    navigator.mediaSession.setActionHandler(`nexttrack`, virstellungNext);
    navigator.mediaSession.setActionHandler(`previoustrack`, virstellungPrevious);
} catch (error) {
    //
}
