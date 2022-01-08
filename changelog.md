# Changelog


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
