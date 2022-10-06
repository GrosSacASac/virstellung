export {virstellung, selectImage, canDisplayInline};

const canDisplayInline = [`video`, `image`, `audio`, `text`];
const identity = function(x) {
    return x;
};



const virstellungBase = ({
    slideItems,
    currentSlide = 0,
    generateHref,
    nextLabel = `Next ➡`,
    previousLabel = `⬅ Previous`,
    id = ``,
    getText = identity,
    onClick,
}) => {
    const maxFocus = slideItems.length - 1;
    if (!currentSlide || !Number.isFinite(currentSlide) || currentSlide > maxFocus) {
        currentSlide = 0;
    }
    // duplicated in script below
    const nextSlide = (currentSlide + 1) % slideItems.length;
    let previousSlide = currentSlide - 1;
    if (previousSlide === -1) {
        previousSlide = slideItems.length - 1;
    }

    let pictureInnerHtml = ``;
    let imagesrc = ``;
    let imagealt = ``;
    let audiosrc = ``;
    let audiomime = ``;
    let videosrc = ``;
    let videmime = ``;
    let text = ``;
    let imageHidden = `hidden`;
    let pictureHidden = `hidden`;
    let audioHidden = `hidden`;
    let videoHidden = `hidden`;
    let textHidden = `hidden`;
    
    const {file, mime, label, files} = slideItems[currentSlide];
    if (mime.startsWith(`image`)) {
        if (files) {
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
            
            pictureHidden = ``;
        } else {
            imageHidden = ``;
            imagealt = label;
            imagesrc = file;
        }
    } else if (mime.startsWith(`video`)) {
        videoHidden = ``;
        videosrc = file;
        videmime = mime;
    } else if (mime.startsWith(`audio`)) {
        audioHidden = ``;
        audiosrc = file;
        audiomime = mime;
    } else if (mime.startsWith(`text`)) {
        textHidden = ``;
        const {fileAlone, temp} = slideItems[currentSlide];
        if (temp) {
            text = temp;
            delete slideItems[currentSlide].temp;
        } else {
            return Promise.resolve(getText(fileAlone)).then(text => {
                slideItems[currentSlide].temp = text;
                return virstellungBase({
                    slideItems,
                    currentSlide,
                    nextLabel,
                    previousLabel,
                    generateHref,
                    id,
                    onClick,
                });
            });
        }
    }
    let clickFunction = ``;
    if (onClick) {
        clickFunction = `data-function="${onClick}" tabindex="0" `;
        generateHref = function () {
            return ``;
        }
    }
    return `
<div data-function="key-ArrowLeft+virstellungPrevious key-ArrowRight+virstellungNext" tabindex="0">
    <div class="imageContainer" ${clickFunction}>
        <picture ${pictureHidden} data-element="picture">
            ${pictureInnerHtml}
        </picture>
        <img data-element="image" alt="${imagealt}" src="${imagesrc}" ${imageHidden}>
        <img data-element="preloader" hidden>
        <audio data-element="audio" type="${audiomime}" src="${audiosrc}" controls autoplay ${audioHidden} data-function="ended-virstellungNext"></audio>
        <video data-element="video" type="${videmime}" src="${videosrc}" controls autoplay ${videoHidden}></video>
        <pre data-element="text" data-variable="text" ${textHidden}>${text}</pre>
        <div class="hoverSelect"><p>✅</p></div>
    </div>
    <p>
        <a class="navbutton" href="${generateHref(previousSlide)}" data-function="virstellungPreviousCancel">${previousLabel}</a>
        <a class="navbutton" href="${generateHref(nextSlide)}" data-function="virstellungNextCancel">${nextLabel}</a>
    </p>
    <input data-variable="currentSlide" type="hidden" value="${currentSlide}">
    <script data-variable="slideItems" type="text/json">${JSON.stringify(slideItems)}</script>
</div>`;
};

const virstellung = async (options) => {
    const {id = ``} = options;
    
    return `
<article class="virstellung" data-scope="${id}">
${await virstellungBase(options)}
</article>`;
};

/*
displays a select with all the images,
if js is enabled and virstellung.js is run with the augmentSelect function then
the select is replaced with a button and a hidden input
the hidden input holds the value and sends it in the form as the select would.
the button is displayed and when clicked opens a dialog to chose an image.
Once chosen the button display and the hidden input value are updated
*/
const selectImage = (options, fileSelected=``) => {
    const {slideItems, id = ``, formName, closeLabel=`Close`} = options;
    //if enabled replace with button
    let currentSlide = 0;
    let labelSelected = `Select`;
    const initialSelect = `<select name=${formName} data-element="initialSelect">
    ${slideItems.map((slideItem, i) => {
        const {file, label, value=file} = slideItem;
        slideItem.value = value;
        let selected = ``;
        if (fileSelected === file) {
            labelSelected = label;
            currentSlide = i;
            selected = `selected`;
        }
        return `<option value="${value}" ${selected}>${label}</option>`;
    }).join(``)}
    </select>`;
    const hiddenButton = `<button hidden data-variable="virstellungLabel" data-function="openVirstellungSelect" data-element="hiddenButton">${labelSelected}</button>`;
    // disabled initially to avoid sending the value twice
    const hiddenInput = `<input disabled type="hidden" data-variable="virstellungSelect" data-element="hiddenInput" name="${formName}" value="${fileSelected}">`;
    const hiddenVirstellung = `<dialog data-element="virstellungSelect" class="virstellung-select">${virstellungBase({...options, onClick: `optionalSelect`, currentSlide})}<form method="dialog"><button>${closeLabel}</button></form></dialog>`;

    const putInsideLabel=`<span class="virstellung-form" data-scope="${id}">${initialSelect}</span>`;
    const putOutsideLabel=`<span hidden data-scope="${id}">${hiddenButton}${hiddenInput}</span>`;
    const putOutsideForm=`<div data-scope="${id}">${hiddenVirstellung}</div>`;
    return [putInsideLabel, putOutsideLabel, putOutsideForm];
};

