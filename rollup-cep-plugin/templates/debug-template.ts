export const debugTemplate = ({
  id,
  hosts,
  startingDebugPort,
  panels,
}: {
  id: string;
  hosts: [
    {
      name: string;
    }
  ];
  startingDebugPort: number;
  panels: [
    {
      name: string;
    }
  ];
}) => {
  let port = startingDebugPort;
  return `
<?xml version="1.0" encoding="UTF-8"?>
<ExtensionList>${panels
    .map(
      ({ name }) =>
        `<Extension Id="${id}.${name}">
      <HostList>
      ${hosts
        .map((host) => `<Host Name="${host.name}" Port="${port++}"/>`)
        .join("")}
      </HostList>
      </Extension>`
    )
    .join("")}
</ExtensionList>
`;
};
