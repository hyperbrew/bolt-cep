import { CEP_Config } from "../cep-config";

export const debugTemplate = (props: CEP_Config) => {
  const { id, hosts, startingDebugPort, panels } = props;
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
