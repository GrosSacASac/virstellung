
import http from "node:http";
import fs from "node:fs";
import url from "node:url";
import path from "node:path";
import {
    httpCodeFromText,
} from "http-code-from-text";
import {parseCli} from "cli-sac";
import mime from "mime";
import { virstellung, selectImage } from "../source/virstellung.html.js";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const cliArgs = parseCli();
let {baseURL} = cliArgs;
baseURL = new URL(baseURL);

const {PORT} = cliArgs;

const slideShowParamName = `a`;
const currentSlideParam = `currentslide`;
const commonCss = `
dialog::backdrop {
    background: rgba(255, 0, 0, 0.25);
  }
dialog::backdrop {
	background: rgba(120,122,230,0.9);
	backdrop-filter: blur(2px);
}

dialog:not([open]) {
	display: none;
}

body {
    margin:0;
    padding:0;
    color: white;
    background-color: #eee;
    background-image: linear-gradient(3330deg, #000012 , #432222);
}
`;

const generateHref = function (index/*, item */) {
    return `?${slideShowParamName}&${currentSlideParam}=${index}`;
};

const items = [
    `branch.jpg`,
    `dance.jpg`,
    `fruity.jpg`,
    `kiss.jpg`,
];

const staticResponses = new Map(Object.entries({
    [`/virstellungAutoLaunch.es.js`]: {
        [`file`]: `${__dirname}/built/virstellungAutoLaunch.es.js`,
        [`Content-Type`]: `application/javascript`,
    },
    [`/selectHelper.es.js`]: {
        [`file`]: `${__dirname}/built/selectHelper.es.js`,
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
        }];
    })),
}));

const handleDynamicPages =  async (request, response) => {
    // console.log(request.parsedUrl.searchParams.get(currentSlideParam));
    if (request.parsedUrl.pathname === `/`) {
    response.writeHead(httpCodeFromText[`OK`],  {[`Content-Type`]: `text/html`});
    response.end(`<!doctype html>
<html >
<head>
    <meta charset="utf-8">
    <title></title>
    <meta name="viewport" content="width=device-width">
    <link media="screen" href="${baseURL}virstellung.css" rel="stylesheet">
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
            <script type="module" src="${baseURL}virstellungAutoLaunch.es.js"></script>
</body></html>`);
    return;
    }

    const [putInsideLabel, putOutsideLabel, putOutsideForm] = selectImage({
        slideItems: items.map(file => {
            return {
                label: file.split(`.`)[0],
                file: `${file}`,
                value: file,
                mime: mime.getType(file),
            };
        }),
        formName: `imageS`,
        id:`imageS`,
        closeLabel: `Close`,
    }, items[0]);
    const [putInsideLabelB, putOutsideLabelB, putOutsideFormB] = selectImage({
        slideItems: items.map(file => {
            return {
                label: file.split(`.`)[0],
                file: `${file}`,
                value: file,
                mime: mime.getType(file),
            };
        }),
        formName: `imageS2`,
        id:`imageS2`,
        closeLabel: `Close second image picker`,
    }, items[1]);
    response.writeHead(httpCodeFromText[`OK`],  {[`Content-Type`]: `text/html`});
    response.end(`<!doctype html>
    <html >
    <head>
        <meta charset="utf-8">
        <title></title>
        <meta name="viewport" content="width=device-width">
        <link media="screen" href="${baseURL}virstellung.css" rel="stylesheet">
        <style>
        .virstellung {
            width: initial;
            height: initial;
        }</style>
        <style>${commonCss}</style>
    </head><body>
        <form method="POST" action="formS"> 
            <label>First image select${putInsideLabel}</label>
            ${putOutsideLabel}
            <label>Second image select${putInsideLabelB}</label>
            ${putOutsideLabelB}

            
            <button>Submit Form</button>
        </form>
    <script type="module" src="${baseURL}selectHelper.es.js"></script>
    ${putOutsideForm}
    ${putOutsideFormB}
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
        console.error(parseError);
    }
    
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

  if (request.method === `POST`) {
    if (request.url === `/formS`) {
        response.setHeader(`Content-Type`, `text/plain; charset=utf-8`);
        request.pipe(response);
        return;
    }
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
