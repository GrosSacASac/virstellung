# Changelog

## 7.3.0

selectImage gets a third optional argument, multiple, if true, it will act like a `<select multiple>`

## 7.2.0

stellFir gets a second argument isMain: default is true. If true the title and media keys are affected by viewing the slides

## 7.1.0

augmentSelect has an additional optional parameter onChange. It will be called with the value, that is selected.

## 7.0.0

Use dom99@26.0.0

- Requires support for Object.hasOwn
- Requires support for document.createTreeWalker
- Requires support for WeakMap

## 6.0.0

- SelectImage returns an array with 3 items
- this is to fix the fact that a label is supposed to only have maximum 1 input
- 0 putInsideLabel with select :  put it inside a label inside a form
- 1 putOutsideLabel: with hidden input: put it after the label in the same form
- 2 putOutsideForm: same as before put it after the form before the closing body

## 5.0.0

- SelectImage returns an array with 2 items
- 0 canPutInisdeForm with select and hidden input
- 1 mustBeOutsideForm with the dialog and the form to close the dialog
- Change is due to the fact that `<form method="dialog"><button>Close` cannot be nested inside another form even if the dialog is hidden
- put the first element where the whole used to be
- and the second just before the body end tag

## 4.2.0

- Add close button to select dialog

## 4.1.0

- selectImage items can have a value property which defaults to its file property. This value is what is used to submit in the form
- file is still used as a `<img src="">`

## 4.0.0

- fileSelected as second argument to selectImage, this should correspond to one of `file` property of one of the items
- selectImage is no longer async and does not support text
- selectImage no longer requires the generateHref option
- selectImage and virstellung no longer take translate as an option
- instead they take 2 new optional options that are strings
- nextLabel
- previousLabel
- pass the following to have it same as before

```js
{
    ...otherOptions,
    previousLabel: `⬅ ${translate(`Précédent`)}`,
    nextLabel: `${translate(`Suivant`)} ➡`,
}
```

## 3.0.0

- Add selectImage server side
- Add augmentSelect client side
- virstellung always return a promise

## 2.1.1

Do not prevent certain keyboard shortcuts (alt+keyleft)

## 2.1.0

support multiple image resolution for 1 item

## 2.0.0

virstellung takes an an argument `generateHref`(index, item) instead of trying to make href be 
`?${otherSearch}&${currentSlideParam}=${nextSlide}` and 
`?${otherSearch}&${currentSlideParam}=${previousSlide}`. Also means that otherSearch and currentSlideParam are no longer needed. To keep the same as before use the following function: 
```js
const generateHref = function (index, item) {
    return `?${otherSearch}&${currentSlideParam}=${index}`;
};
```

## 1.0.0

Publish
