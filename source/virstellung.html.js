export {virstellung};


const virstellung = (
    filesToDisplayInline = [],
    currentSlide = 0,
    t = function(){},
    currentSlideParam = `v`,
    otherSearch = ``,
) => {
    const maxFocus = filesToDisplayInline.length - 1;
    if (!currentSlide || !Number.isFinite(currentSlide) || currentSlide > maxFocus) {
        currentSlide = 0;
    }
    // duplicated in script below
    const nextSlide = (currentSlide + 1) % filesToDisplayInline.length;
    let previousSlide = currentSlide - 1;
    if (previousSlide === -1) {
        previousSlide = filesToDisplayInline.length - 1;
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
    
    const {file, mime, label} = filesToDisplayInline[currentSlide];
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
        <a class="navbutton" href="?${otherSearch}&${currentSlideParam}=${previousSlide}" data-function="previous">⬅ ${t(`Précédent`)}</a>
        <a class="navbutton" href="?${otherSearch}&${currentSlideParam}=${nextSlide}" data-function="next">${t(`Suivant`)} ➡</a>
    </p>
    <script type="module">
        window.filesToDisplayInline = ${JSON.stringify(filesToDisplayInline)};
        window.currentSlide = ${currentSlide};
    </script>
</article>`;
};

