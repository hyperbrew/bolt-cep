export const menuHtmlTemplate = ({
  displayName,
  menu,
}: {
  displayName: string;
  menu: [{ name: string; url: string }];
}) => `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>${displayName}</title>
    <style>
    body {
      background-color: #222;
      color: #eee;
      font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
    }
    .menu{
    }
    a {
      display: block;
      font-size: 1rem;
      color: #eee;
      text-decoration: none;
      cursor: pointer;
    }
    a:hover {
      color: #4ea9ff;
    }
  </style>
  </head>

  <body>
  <h2>Select Panel</h2>
    <div class="menu">
      ${menu
        .map((item) => `<a href="${item.url}">- ${item.name}</a>`)
        .join("\n\t\t\t")}
    </div>
  </body>
</html>

`;
