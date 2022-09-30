export {supportsDialog};

const supportsDialog = Boolean((document.createElement("dialog")).showModal);
