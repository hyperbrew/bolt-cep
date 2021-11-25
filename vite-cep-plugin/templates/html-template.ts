export const htmlTemplate = ({
  displayName,
  debugReact,
  jsFileName,
  cssFileNames,
}: {
  displayName: string;
  debugReact: boolean;
  jsFileName: string;
  cssFileNames: string[];
}) => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>${displayName}</title>
    ${cssFileNames
      .map((file) => `<link rel="stylesheet" href="..${file}">`)
      .join("\n\t\t")}
    <script src="https://unpkg.com/browser-cjs/require.min.js"></script>
    </head>
    <body>
      <div id="root"></div>
      ${
        debugReact
          ? `
      <!-- React Dev Tools Debugger Connection -->
      <script src="http://localhost:8097"></script>`
          : ``
      }
      <script src="..${jsFileName}"></script>
  </body>
</html>
`;
