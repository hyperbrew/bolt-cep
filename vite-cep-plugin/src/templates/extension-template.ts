import type { CEP_Extended_Panel } from "../cep-config";

export const extensionTemplate = ({
  id,
  name,
  parameters,
  autoVisible,
  mainPath,
  type,
  host,
  panelDisplayName,
  width,
  height,
  minWidth,
  minHeight,
  maxWidth,
  maxHeight,
  iconNormal,
  iconDarkNormal,
  iconNormalRollOver,
  iconDarkNormalRollOver,
  scriptPath,
  startOnEvents,
}: CEP_Extended_Panel) => `<Extension Id="${id}">
<DispatchInfo${host ? ` Host="${host}"` : ""}>
  <Resources>
    <MainPath>${mainPath}</MainPath>${
  (scriptPath && `<ScriptPath>${scriptPath}</ScriptPath>`) || ""
}<CEFCommandLine>${
  (parameters &&
    parameters
      .map((item) => `\n<Parameter>${item.toString()}</Parameter>`)
      .join("")) ||
  ""
}
    </CEFCommandLine>
  </Resources>
  <Lifecycle>
    <AutoVisible>${autoVisible}</AutoVisible>${
  (startOnEvents &&
    `<StartOn>${startOnEvents
      .map((event) => `\n<Event>${event}</Event>`)
      .join("")}</StartOn>`) ||
  ""
} 
  </Lifecycle>
  <UI>
    <Type>${type}</Type>
    ${panelDisplayName ? `<Menu>${panelDisplayName}</Menu>` : ""}
    <Geometry>${
      width && height
        ? `<Size>
        <Width>${width}</Width>
        <Height>${height}</Height>
      </Size>`
        : ""
    }${
  maxWidth && maxHeight
    ? `<MaxSize>
        <Width>${maxWidth}</Width>
        <Height>${maxHeight}</Height>
      </MaxSize>`
    : ""
}${
  minWidth && minHeight
    ? `<MinSize>
        <Width>${minWidth}</Width>
        <Height>${minHeight}</Height>
      </MinSize>`
    : ""
}</Geometry>
    <Icons>
      <Icon Type="Normal">${iconNormal}</Icon>
      <Icon Type="DarkNormal">${iconDarkNormal}</Icon>
      <Icon Type="RollOver">${iconNormalRollOver}</Icon>
      <Icon Type="DarkRollOver">${iconDarkNormalRollOver}</Icon>
    </Icons>
  </UI>
</DispatchInfo>
</Extension>
`;
