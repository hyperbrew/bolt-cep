import type { CEP_Config_Extended } from "../cep-config";

export const debugTemplate = (props: CEP_Config_Extended) => {
  const { id, hosts, startingDebugPort, panels } = props;
  let port = startingDebugPort;
  return `
<?xml version="1.0" encoding="UTF-8"?>
<ExtensionList>${panels
    .map(
      ({ id }) =>
        `<Extension Id="${id}">
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
