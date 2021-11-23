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
