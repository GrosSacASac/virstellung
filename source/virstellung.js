export {stellFir, augmentSelect};

import * as d from "dom99";
import { memoizeAsStrings } from "utilsac";
import { keyboard } from "dom99/plugins/keyboard/keyboard.js";
import { supportsDialog } from "./dialog.js";


const e0 = `error loading`;
d.plugin(keyboard);
const initialTitle = document.title;
// used for media keys
let lastScope;

const slideItemsFromScope = memoizeAsStrings((scope) => {
    return JSON.parse(d.get(scope, `slideItems`));
});

const virstellungPreviousCancel = function (event) {
    event?.preventDefault?.();
    return virstellungPrevious(event);
};

const virstellungPrevious = function (event) {
    const scope = d.scopeFromEvent(event) ?? lastScope;
    lastScope = scope;
    let currentSlide = Number(d.get(scope, `currentSlide`));
    
    currentSlide = currentSlide - 1;
    if (currentSlide === -1) {
        const slideItems = slideItemsFromScope(scope);
        currentSlide = slideItems.length - 1;
    }
    displayX(currentSlide, scope);
};

const virstellungNextCancel = function (event) {
    event?.preventDefault?.();
    return virstellungNext(event);
};

const virstellungNext = function (event) {
    const scope = d.scopeFromEvent(event) ?? lastScope;
    lastScope = scope;
    const slideItems = slideItemsFromScope(scope);
    const currentSlide = (Number(d.get(scope, `currentSlide`)) + 1) % slideItems.length;
    displayX(currentSlide, scope);
    preloadX((currentSlide + 1) % slideItems.length, scope);
};

const preloadX = function (slide, scope) {
    // only preload images
    const slideItems = slideItemsFromScope(scope);
    const { url, mime } = slideItems[slide];
    if (mime.includes(`image`) && url) {
        d.elements[d.scopeFromArray([scope, `preloader`])].src = url;
    }
};

const displayX = function (currentSlide, scope) {
    const slideItems = slideItemsFromScope(scope);
    const { url, mime, label, sources } = slideItems[currentSlide];
    d.feed(d.scopeFromArray([scope, `currentSlide`]), String(currentSlide));
    const image = d.elements[d.scopeFromArray([scope, `image`])];
    const picture = d.elements[d.scopeFromArray([scope, `picture`])];
    const video = d.elements[d.scopeFromArray([scope, `video`])];
    const audio = d.elements[d.scopeFromArray([scope, `audio`])];
    const text = d.elements[d.scopeFromArray([scope, `text`])];
    text.hidden = true;
    picture.hidden = true;
    image.hidden = true;
    video.hidden = true;
    audio.hidden = true;
    
    if (mime.startsWith(`image`)) {
        if (sources) {
            picture.hidden = false;
            let pictureInnerHtml = ``;
            sources.forEach((imageVersion, i) => {
                const {mime, url, media} = imageVersion;
                let sourceHtml;
                if (i + 1 < sources.length) {
                    sourceHtml = `<source srcset="${url}" media="${media}" type="${mime}">`;

                } else {
                    // last source should be fallback image
                    sourceHtml = `<img alt="${label}" src="${url}" type="${mime}">`;
                }
                pictureInnerHtml = `${pictureInnerHtml}${sourceHtml}`;
            });
            picture.innerHTML = pictureInnerHtml;
        } else {
            image.alt = label;
            image.hidden = false;
            image.src = url;
        }
        video.pause();
        audio.pause();
    } else if (mime.startsWith(`video`)) {
        video.hidden = false;
        video.src = url;
        video.type = mime;
        audio.pause();
    } else if (mime.startsWith(`audio`)) {
        audio.hidden = false;
        audio.src = url;
        audio.type = mime;
        video.pause();
    } else if (mime.startsWith(`text`)) {
        text.hidden = false;
        video.pause();
        audio.pause();
        fetch(url).then(response => {
            if (!response.ok) {
                throw e0;
            }
            return response.text();
        }).then(responseAsString => {
            d.feed(d.scopeFromArray([scope, `text`]), responseAsString);
        }).catch(error => {
            d.feed(d.scopeFromArray([scope, `text`]), e0);
        });
    }

    if (d.get(d.scopeFromArray([scope, `isMain`])) && navigator.mediaSession) {
        document.title = `${initialTitle} ${label}`;
        navigator.mediaSession.metadata = new MediaMetadata({
            title: url,
        });
    }
    const multiple = Boolean(d.elements[d.scopeFromArray([scope, `initialSelect`])]?.hasAttribute(`multiple`));
    if (multiple) {
        let currentSelection = d.get(d.scopeFromArray([scope, `virstellungSelection`]));
        if (!currentSelection) {
            currentSelection = [];
        }
        const alreadySelected = currentSelection.includes(currentSlide);
        d.elements[d.scopeFromArray([scope, `optionalSelect`])].classList.toggle(`selected`, alreadySelected);
    }
};

d.functions.confirmSelect = function(event) {
    const scope = d.scopeFromEvent(event) ?? lastScope;
    const slideItems = slideItemsFromScope(scope);
    const multiple = Boolean(d.elements[d.scopeFromArray([scope, `initialSelect`])]?.hasAttribute(`multiple`));
    const cancelling = (d.elements[d.scopeFromArray([scope, `virstellungSelect`])].returnValue === ``);
    if (cancelling) {
        return;
    }
    if (!multiple) {
        d.functions.optionalSelect(event);
        return;
    }
    const currentSelection = d.get(d.scopeFromArray([scope, `virstellungSelection`]));
    const values = currentSelection.map(function(index) {
        return slideItems[index].value;
    });
    selectOnChange.get(d.elements[d.scopeFromArray([scope, `hiddenInput`])])(values);
    
    d.feed(d.scopeFromArray([scope, `virstellungLabel`]), `${currentSelection.length}`);
    d.feed(d.scopeFromArray([scope, `virstellungSelect`]), values.join(`,`));
};

d.functions.optionalSelect = function(event) {
    const scope = d.scopeFromEvent(event) ?? lastScope;
    const slideItems = slideItemsFromScope(scope);
    const multiple = Boolean(d.elements[d.scopeFromArray([scope, `initialSelect`])]?.hasAttribute(`multiple`));
    
    const currentSlide = Number(d.get(scope, `currentSlide`));
    d.feed(d.scopeFromArray([scope, `selected`]), currentSlide);
    d.feed(d.scopeFromArray([scope, `virstellungSelect`]), slideItems[currentSlide].value);
    d.feed(d.scopeFromArray([scope, `virstellungLabel`]), slideItems[currentSlide].label);
    if (!multiple) {
        d.elements[d.scopeFromArray([scope, `virstellungSelect`])].close();
        if (event) {
            selectOnChange.get(d.elements[d.scopeFromArray([scope, `hiddenInput`])])(slideItems[currentSlide].value);
        }
        return;
    }
    const currentSelection = d.get(d.scopeFromArray([scope, `virstellungSelection`]));
    const alreadySelected = currentSelection.includes(currentSlide);
    if (alreadySelected) {
        
        currentSelection.splice(currentSelection.indexOf(currentSlide), 1);

    } else {
        currentSelection.push(currentSlide);
    }
    d.elements[d.scopeFromArray([scope, `optionalSelect`])].classList.toggle(`selected`, !alreadySelected);
    d.feed(d.scopeFromArray([scope, `virstellungSelection`]), currentSelection);
    d.feed(d.scopeFromArray([scope, `count`]), ` (${currentSelection.length})`);
};


d.functions.openVirstellungSelect = function (event) {
    event.preventDefault();
    const scope = d.scopeFromEvent(event) ?? lastScope;
    lastScope = scope;
    const currentSlideSelected = Number(d.get(scope, `selected`));
    displayX(currentSlideSelected, scope);
    d.elements[d.scopeFromArray([scope, `virstellungSelect`])].showModal();
};

const stellFir = (id = ``, isMain = true) => {
    
    d.feed(id, {isMain});
    d.start({
        dataFunctions: {
            virstellungNext,
            virstellungNextCancel,
            virstellungPrevious,
            virstellungPreviousCancel,
        },
    });
    d.elements[d.scopeFromArray([id, `audio`])].volume = 0.5;
    d.elements[d.scopeFromArray([id, `video`])].volume = 0.5;
    lastScope = lastScope ?? id;
    if (isMain) {
        try {
            navigator.mediaSession.setActionHandler(`nexttrack`, virstellungNext);
            navigator.mediaSession.setActionHandler(`previoustrack`, virstellungPrevious);
        } catch (error) {
            //
        }
    }
};

const selectOnChange = new WeakMap();

const augmentSelect = (id = ``, onChange = function(){}) => {
    if (!supportsDialog) {
        return;
    }
    stellFir(id, false);
    // can only have 1 input per <label>
    const insideLabelNode = d.elements[d.scopeFromArray([id, `initialSelect`])].parentNode;
    const multiple = Boolean(d.elements[d.scopeFromArray([id, `initialSelect`])]?.hasAttribute(`multiple`));
    d.elements[d.scopeFromArray([id, `initialSelect`])].remove();
    insideLabelNode.appendChild(d.elements[d.scopeFromArray([id, `hiddenButton`])]);
    d.elements[d.scopeFromArray([id, `hiddenButton`])].hidden = false;
    d.elements[d.scopeFromArray([id, `hiddenInput`])].disabled = false;
    selectOnChange.set(d.elements[d.scopeFromArray([id, `hiddenInput`])], onChange);
    
    const currentSlide = (Number(d.get(id, `currentSlide`)));
    lastScope = id;
    if (!multiple) {
        displayX(currentSlide, id);

        d.functions.optionalSelect();
        return;
    }
    
    const slideItems = slideItemsFromScope(id);
    d.feed(d.scopeFromArray([id, `selected`]), currentSlide);
    d.feed(d.scopeFromArray([id, `virstellungSelect`]), slideItems[currentSlide].value);
    d.feed(d.scopeFromArray([id, `virstellungLabel`]), slideItems[currentSlide].label);
    const currentSelection = d.get(d.scopeFromArray([id, `virstellungSelect`])).split(`,`).map(function (value) {
        return slideItems.findIndex(({url}) => {
            return value === url;
        });
    });
    
    d.feed(d.scopeFromArray([id, `virstellungSelection`]), currentSelection);
    
    displayX(currentSlide, id);

};
