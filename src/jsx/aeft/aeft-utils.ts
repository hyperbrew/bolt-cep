export const forEachLayer = (
  comp: CompItem,
  callback: (item: Layer, index: number) => void
) => {
  const len = comp.numLayers;
  for (let i = 1; i < len + 1; i++) {
    callback(comp.layers[i], i);
  }
};

export const compFromFootage = (item: FootageItem): CompItem => {
  return app.project.items.addComp(
    item.name,
    item.width,
    item.height,
    item.pixelAspect,
    item.duration,
    item.frameRate
  );
};

export const getProjectDir = () => {
  app.project.file;
  if (app.project.file !== null) {
    //@ts-ignore
    return app.project.file.parent;
  } else {
    return "";
  }
};

export const getActiveComp = () => {
  if (app.project.activeItem instanceof CompItem === false) {
    app.activeViewer?.setActive();
  }
  return app.project.activeItem as CompItem;
};
