
import http from "node:http";
import fs from "node:fs";
import url from "node:url";
import path from "node:path";
import {
    httpCodeFromText,
} from "http-code-from-text";
import {parseCli} from "cli-sac";
import { virstellung, canDisplayInline as displayInline } from "../source/virstellung.html.js";
import mime from "mime";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const cliArgs = parseCli();
let {baseURL} = cliArgs;
baseURL = new URL(baseURL);

const {PORT} = cliArgs;

const slideShowParamName="a";
const currentSlideParam = "currentslide";
const commonCss = ``;

const generateHref = function (index/*, item */) {
    return `?${slideShowParamName}&${currentSlideParam}=${index}`;
};

const items = [
    "branch.jpg",
    "dance.jpg",
    "fruity.jpg",
    "kiss.jpg",
];

const staticResponses = new Map(Object.entries({
    [`/virstellung.js`]: {
        [`file`]: `${__dirname}/built/virstellung.es.js`,
        [`Content-Type`]: `application/javascript`,
    },
    [`/virstellung.css`]: {
        [`file`]: `${__dirname}/../source/virstellung.css`,
        [`Content-Type`]: `text/css`,
    },
    ...Object.fromEntries(items.map(function (item) {
        return [`/${item}`, {
            [`file`]: `${__dirname}/images/${item}`,
            [`Content-Type`]: mime.getType(item),
        }]
    }))
}));

const handleDynamicPages =  async (request, response) => {
    // console.log(request.parsedUrl.searchParams.get(currentSlideParam));
    response.writeHead(httpCodeFromText[`OK`],  {[`Content-Type`]: `text/html`});
    response.end(`<!doctype html>
<html lang="${request.lang}">
<head>
    <meta charset="utf-8">
    <title></title>
    <meta name="viewport" content="width=device-width">
    <link media="screen" href="${baseURL}virstellung.css" rel="stylesheet">
    <style>
    body {
        margin:0;
        padding:0;
        background-color: #eee;
        background-image: linear-gradient(3330deg, #000012 , #432222);
    }</style>
    <style>${commonCss}</style>
</head><body>    
            ${await virstellung({
                slideItems: items.map(file => {
                    return {
                        label: file,
                        file: `${file}`,
                        fileAlone: file,
                        mime: mime.getType(file),
                    };
                }),
                currentSlide: Number(request.parsedUrl.searchParams.get(currentSlideParam)),
                generateHref,
            })}
            <script type="module" src="${baseURL}virstellung.js"></script>
</body></html>`);
    return;        
        
};

const handleStatic = (request, response) => {
    if (staticResponses.has(request.url)) {
        response.writeHead(httpCodeFromText[`OK`], {[`Content-Type`]: staticResponses.get(request.url)[`Content-Type`]});
        fs.createReadStream(staticResponses.get(request.url)[`file`]).pipe(response);
        return true;
    }
};


const server = http.createServer(async (request, response) => {
    request.on(`error`, console.error.bind(console, `request error`));
    response.on(`error`, console.error.bind(console, `response error`));

    let parseError;
    try {
        request.parsedUrl = new URL(request.url, baseURL);
    } catch (error) {
        parseError = error;
        console.error(parseError)
    }
    request.parsedUrl = parsedUrl
    
    let handled;
    if (request.method === `GET`) {
        handled = handleStatic(request, response);
        if (handled) {
            return;
        }
    }
    
    if (request.method === `GET`) {
        handled = handleDynamicPages(request, response);
        
        if (!handled) {
            const error = `Not Found`;
            response.writeHead(httpCodeFromText[error], {[`Content-Type`]: `text/plain; charset=utf-8`});
            response.end(request.t(`e1`));
        }
      return;
  }
  
  response.setHeader(`Content-Type`, `text/plain; charset=utf-8`);
  const error = `Method Not Allowed`;
  response.writeHead(httpCodeFromText[error]);
  response.end(error);
});

const startServer = function () {
    server.listen(PORT);
    console.log(`Listening on ${PORT}
`);
};

startServer();
