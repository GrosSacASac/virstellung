# Changelog

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
