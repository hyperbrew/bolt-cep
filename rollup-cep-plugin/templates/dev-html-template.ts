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
  </head>

  <body>
    <div id="root"></div>
    <script>
      window.location.href = '${url}';
    </script>
  </body>
</html>

`;
