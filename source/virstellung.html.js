export {virstellung};


const virstellung = ({
    slideItems,
    currentSlide = 0,
    translate = function(code) {
        return code;
    },
    currentSlideParam = `v`,
    otherSearch = ``,
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
    let imageHidden = `hidden`;
    let audioHidden = `hidden`;
    let videoHidden = `hidden`;
    
    const {file, mime, label} = slideItems[currentSlide];
    if (mime.includes(`image`)) {
        imageHidden = ``;
        imagealt = label;
        imagesrc = file;
    } else if (mime.includes(`video`)) {
        videoHidden = ``;
        videosrc = file;
        videmime = mime;
    } else if (mime.includes(`audio`)) {
        audioHidden = ``;
        audiosrc = file;
        audiomime = mime;
    }
    return `
<article class="imageContainer" data-function="move-37+previous move-39+next">
    <div class="imageContainer">
        <img data-element="image" alt="${imagealt}" src="${imagesrc}" ${imageHidden}>
        <img data-element="preloader" hidden>
        <audio data-element="audio" type="${audiomime}" src="${audiosrc}" controls autoplay ${audioHidden}></audio>
        <video data-element="video" type="${videmime}" src="${videosrc}" controls autoplay ${videoHidden}></video>
    </div>
    <p>
        <a class="navbutton" href="?${otherSearch}&${currentSlideParam}=${previousSlide}" data-function="previous">⬅ ${translate(`Précédent`)}</a>
        <a class="navbutton" href="?${otherSearch}&${currentSlideParam}=${nextSlide}" data-function="next">${translate(`Suivant`)} ➡</a>
    </p>
    <script type="module">
        window.slideItems = ${JSON.stringify(slideItems)};
        window.currentSlide = ${currentSlide};
    </script>
</article>`;
};

