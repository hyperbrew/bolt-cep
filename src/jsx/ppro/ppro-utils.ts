export const forEachChild = (
  item: ProjectItem,
  callback: (item: ProjectItem) => void
) => {
  const len = item.children.numItems;
  for (let i = 0; i < len; i++) {
    callback(item.children[i]);
  }
};

export const deleteItem = (item: ProjectItem) => {
  if (item.type === 2 /* BIN */) {
    item.deleteBin();
  } else {
    const tmpBin = app.project.rootItem.createBin("tmp");
    item.moveBin(tmpBin);
    tmpBin.deleteBin();
  }
};

export const getSequenceLengthInFrames = (seq: Sequence) => {
  const settings = seq.getSettings();
  const end = seq.end;
  const fps = settings.videoFrameRate.ticks;
  const frames = parseInt(end) / parseInt(fps);
  return frames;
};

// Audio Conversions

export const dbToDec = (x: number) => Math.pow(10, (x - 15) / 20);

export const decToDb = (x: number) => 20 * Math.log(x) * Math.LOG10E + 15;
