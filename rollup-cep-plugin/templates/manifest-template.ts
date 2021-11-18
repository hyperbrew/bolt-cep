import { extensionTemplate } from "./extension-template";
export const manifestTemplate = (props: {
  extensionManifestVersion: string;
  id: string;
  displayName: string;
  version: string;
  scriptPath: string;
  hosts: [{ name: string; version: string }];
  requiredRuntimeVersion: string;
  panels: [{ name: string }];
}) => {
  const {
    extensionManifestVersion,
    id,
    displayName,
    version,
    scriptPath,
    hosts,
    requiredRuntimeVersion,
    panels,
  } = props;
  return `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<ExtensionManifest
    Version="${extensionManifestVersion}" 
    ExtensionBundleId="${id}"
    ExtensionBundleVersion="${version}"
    ExtensionBundleName="${displayName}" 
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  >
  <ExtensionList>
    ${panels
      .map(
        ({ name }) => `<Extension Id="${id}.${name}" Version="${version}" />`
      )
      .join("")}
	</ExtensionList>
	<ExecutionEnvironment>
    <HostList>
    ${hosts
      .map((host) => `<Host Name="${host.name}" Version="${host.version}" />`)
      .join("")}
		</HostList>
		<LocaleList>
			<Locale Code="All" />
		</LocaleList>
		<RequiredRuntimeList>
			<RequiredRuntime Name="CSXS" Version="${requiredRuntimeVersion}" />
		</RequiredRuntimeList>
	</ExecutionEnvironment>
	<DispatchInfoList>
    ${panels.map((panel) => {
      let newProps: any = { ...props, ...panel };
      return extensionTemplate({
        id: newProps.id,
        name: newProps.name,
        parameters: newProps.parameters,
        autoVisible: newProps.autoVisible,
        mainPath: newProps.mainPath,
        scriptPath: newProps.scriptPath,
        type: newProps.type,
        panelDisplayName: newProps.panelDisplayName,
        width: newProps.width,
        height: newProps.height,
        iconNormal: newProps.iconNormal,
        iconDarkNormal: newProps.iconDarkNormal,
        iconNormalRollOver: newProps.iconNormalRollOver,
        iconDarkNormalRollOver: newProps.iconDarkNormalRollOver,
      });
    })}
	</DispatchInfoList>
	</ExtensionManifest>`;
};
