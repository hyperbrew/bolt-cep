import type { CEP_Config_Extended } from "../cep-config";
import { extensionTemplate } from "./extension-template";
export const manifestTemplate = (props: CEP_Config_Extended) => {
  const {
    extensionManifestVersion,
    id,
    displayName,
    version,
    hosts,
    requiredRuntimeVersion,
    standalone,
    panels,
  } = props;
  return `<?xml version="1.0" encoding="UTF-8" standalone="${
    standalone ? "yes" : "no"
  }"?>
<ExtensionManifest
    Version="${extensionManifestVersion.toFixed(1)}" 
    ExtensionBundleId="${id}"
    ExtensionBundleVersion="${version}"
    ExtensionBundleName="${displayName}" 
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  >
  <ExtensionList>
    ${panels
      .map((panel) => `<Extension Id="${panel.id}" Version="${version}" />`)
      .filter((value, index, self) => self.indexOf(value) === index) // remove duplicates
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
			<RequiredRuntime Name="CSXS" Version="${requiredRuntimeVersion.toFixed(1)}" />
		</RequiredRuntimeList>
	</ExecutionEnvironment>
	<DispatchInfoList>${panels
    .map((panel) => extensionTemplate(panel))
    .join("")}</DispatchInfoList>
	</ExtensionManifest>`;
};
