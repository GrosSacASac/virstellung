export {virstellung, canDisplayInline};

const canDisplayInline = [`video`, `image`, `audio`, `text`];
const identity = function(x) {
    return x;
}



const virstellung = ({
    slideItems,
    currentSlide = 0,
    generateHref,
    translate = identity,
    id = ``,
    getText = identity,
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

    let imagesrc = ``;
    let imagealt = ``;
    let audiosrc = ``;
    let audiomime = ``;
    let videosrc = ``;
    let videmime = ``;
    let text = ``;
    let imageHidden = `hidden`;
    let audioHidden = `hidden`;
    let videoHidden = `hidden`;
    let textHidden = `hidden`;
    
    const {file, mime, label} = slideItems[currentSlide];
    if (mime.startsWith(`image`)) {
        imageHidden = ``;
        imagealt = label;
        imagesrc = file;
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
                return virstellung({
                    slideItems,
                    currentSlide,
                    translate,
                    currentSlideParam,
                    otherSearch,
                    id,
                })
            });
        }
    }
    return `
<article class="virstellung" data-scope="${id}">
<div data-function="key-ArrowLeft+virstellungPrevious key-ArrowRight+virstellungNext" tabindex="0">
    <div class="imageContainer">
        <img data-element="image" alt="${imagealt}" src="${imagesrc}" ${imageHidden}>
        <img data-element="preloader" hidden>
        <audio data-element="audio" type="${audiomime}" src="${audiosrc}" controls autoplay ${audioHidden} data-function="ended-virstellungNext"></audio>
        <video data-element="video" type="${videmime}" src="${videosrc}" controls autoplay ${videoHidden}></video>
        <pre data-element="text" data-variable="text" ${textHidden}>${text}</pre>
    </div>
    <p>
        <a class="navbutton" href="${generateHref(previousSlide)}" data-function="virstellungPrevious">⬅ ${translate(`Précédent`)}</a>
        <a class="navbutton" href="${generateHref(nextSlide)}" data-function="virstellungNext">${translate(`Suivant`)} ➡</a>
    </p>
    <input data-variable="currentSlide" type="hidden" value="${currentSlide}">
    <script data-variable="slideItems" type="text/json">${JSON.stringify(slideItems)}</script>
</div>
</article>`;
};

