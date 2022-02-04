export {stellFir};

import * as d from "dom99";
import { keyboard } from "dom99/plugins/keyboard/keyboard.js";


const e0 = `error loading`;
d.plugin(keyboard);
window.d = d;
const initialTitle = document.title;
// used for media keys
let lastScope;

const slideItemsFromScope = (scope) => {
    return JSON.parse(d.get(scope, "slideItems"));
}

const virstellungPrevious = function (event) {
    event?.preventDefault?.();

    const scope = d.scopeFromEvent(event) ?? lastScope;
    lastScope = scope;
    let currentSlide = Number(d.get(scope, "currentSlide"));
    
    currentSlide = currentSlide - 1;
    if (currentSlide === -1) {
        const slideItems = slideItemsFromScope(scope);
        currentSlide = slideItems.length - 1;
    }
    displayX(currentSlide, scope);
};

const virstellungNext = function (event) {
    event?.preventDefault?.();

    const scope = d.scopeFromEvent(event) ?? lastScope;
    lastScope = scope;
    const slideItems = slideItemsFromScope(scope);
    let currentSlide = (Number(d.get(scope, "currentSlide")) + 1) % slideItems.length;
    displayX(currentSlide, scope);
    preloadX((currentSlide + 1) % slideItems.length, scope);
};

const preloadX = function (slide, scope) {
    // only preload images
    const slideItems = slideItemsFromScope(scope);
    const { file, mime } = slideItems[slide];
    if (mime.includes(`image`) && file) {
        d.elements[d.scopeFromArray([scope, "preloader"])].src = file;
    }
};

const displayX = function (currentSlide, scope) {
    const slideItems = slideItemsFromScope(scope);
    const { file, mime, label, files } = slideItems[currentSlide];
    d.feed(d.scopeFromArray([scope, "currentSlide"]), String(currentSlide));
    document.title = `${initialTitle} ${label}`;
    const image = d.elements[d.scopeFromArray([scope, "image"])];
    const picture = d.elements[d.scopeFromArray([scope, "picture"])];
    const video = d.elements[d.scopeFromArray([scope, "video"])];
    const audio = d.elements[d.scopeFromArray([scope, "audio"])];
    const text = d.elements[d.scopeFromArray([scope, "text"])];
    text.hidden = true;
    picture.hidden = true;
    image.hidden = true;
    video.hidden = true;
    audio.hidden = true;
    
    if (mime.startsWith(`image`)) {
        if (files) {
            picture.hidden = false;
            let pictureInnerHtml = ``;
            files.forEach((imageVersion, i) => {
                const {mime, file, media} = imageVersion;
                let sourceHtml;
                if (i + 1 < files.length) {
                    sourceHtml = `<source srcset="${file}" media="${media}" type="${mime}">`;

                } else {
                    // last source should be fallback image
                    sourceHtml = `<img alt="${label}" src="${file}" type="${mime}">`;
                }
                pictureInnerHtml = `${pictureInnerHtml}${sourceHtml}`;
            });
            picture.innerHTML = pictureInnerHtml;
        } else {
            image.alt = label;
            image.hidden = false;
            image.src = file;
        }
        video.pause();
        audio.pause();
    } else if (mime.startsWith(`video`)) {
        video.hidden = false;
        video.src = file;
        video.type = mime;
        audio.pause();
    } else if (mime.startsWith(`audio`)) {
        audio.hidden = false;
        audio.src = file;
        audio.type = mime;
        video.pause();
    } else if (mime.startsWith(`text`)) {
        text.hidden = false;
        video.pause();
        audio.pause();
        fetch(file).then(response => {
            if (!response.ok) {
                throw e0;
            }
            return response.text();
        }).then(responseAsString => {
            d.feed(d.scopeFromArray([scope, "text"]), responseAsString);
        }).catch(error => {
            d.feed(d.scopeFromArray([scope, "text"]), e0);
        });
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
    lastScope = lastScope ?? id; 
}

try {
    navigator.mediaSession.setActionHandler(`nexttrack`, virstellungNext);
    navigator.mediaSession.setActionHandler(`previoustrack`, virstellungPrevious);
} catch (error) {
    //
}
