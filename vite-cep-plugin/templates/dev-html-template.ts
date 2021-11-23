export const devHtmlTemplate = ({
  displayName,
  url,
}: {
  displayName: string;
  url: string;
}) => `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>${displayName}</title>
    <script src="https://unpkg.com/browser-cjs/require.min.js"></script>
  </head>

  <body>
    <div id="root"></div>
    <script>
      window.location.href = '${url}';
    </script>
  </body>
</html>

`;
