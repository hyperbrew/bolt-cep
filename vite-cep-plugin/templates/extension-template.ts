export const extensionTemplate = ({
  id,
  name,
  parameters,
  autoVisible,
  mainPath,
  type,
  panelDisplayName,
  width,
  height,
  iconNormal,
  iconDarkNormal,
  iconNormalRollOver,
  iconDarkNormalRollOver,
}: {
  id: string;
  name: string;
  parameters: string[];
  autoVisible: string;
  mainPath: string;
  scriptPath: string;
  type: string;
  panelDisplayName: string;
  width: string;
  height: string;
  iconNormal: string;
  iconDarkNormal: string;
  iconNormalRollOver: string;
  iconDarkNormalRollOver: string;
}) => `
<Extension Id="${id}.${name}">
<DispatchInfo >
  <Resources>
    <MainPath>${mainPath}</MainPath>
    <CEFCommandLine>
      ${parameters
        .map((item) => `<Parameter>${item.toString()}</Parameter>`)
        .join("\n")}
    </CEFCommandLine>
  </Resources>
  <Lifecycle>
    <AutoVisible>${autoVisible}</AutoVisible>
  </Lifecycle>
  <UI>
    <Type>${type}</Type>
    ${panelDisplayName ? `<Menu>${panelDisplayName}</Menu>` : ""}
    <Geometry>
      <Size>
        <Width>${width}</Width>
        <Height>${height}</Height>
      </Size>
    </Geometry>
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
