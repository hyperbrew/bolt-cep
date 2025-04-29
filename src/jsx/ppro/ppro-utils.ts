// ProjectItem Helpers

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

export const getChildByName = (item: ProjectItem, name: string) => {
  for (let i = 0; i < item.children.numItems; i++) {
    const child = item.children[i];
    if (child.name === name) {
      return child;
    }
  }
};

export const getChildByNodeId = (item: ProjectItem, nodeId: string) => {
  for (let i = 0; i < item.children.numItems; i++) {
    const child = item.children[i];
    if (child.nodeId === nodeId) {
      return child;
    }
  }
};

export const getChildFromTreePath = (project: Project, treePath: string) => {
  const elements = treePath.split("\\"); // first item is blank, second is root
  let projectItem: ProjectItem | undefined = project.rootItem;
  for (let i = 2; i < elements.length; i++) {
    const item = elements[i];
    projectItem = getChildByName(projectItem, item);
    if (!projectItem) return null;
  }
  return projectItem;
};

export const getDescendantByNodeId = (
  item: ProjectItem,
  nodeId: string
): ProjectItem | undefined => {
  for (let i = 0; i < item.children.numItems; i++) {
    const child = item.children[i];
    if (child.nodeId === nodeId) {
      return child;
    } else if (child.type === 2 /* BIN */) {
      const found = getDescendantByNodeId(child, nodeId);
      if (found) return found;
    }
  }
};

export const getParentItem = (item: ProjectItem) => {
  const dir = item.treePath.split("\\");
  if (dir.length < 2) {
    return app.project.rootItem;
  }
  let current = app.project.rootItem;
  for (let i = 2; i < dir.length - 1; i++) {
    const name = dir[i];
    const next = getChildByName(current, name);
    if (next) {
      current = next;
    }
  }
  return current;
};

export const findItemByPath = (
  item: ProjectItem,
  path: string
): ProjectItem | undefined => {
  const len = item.children.numItems;
  for (let i = 0; i < len; i++) {
    const child = item.children[i];
    if (child.children && child.children.numItems > 0) {
      const res = findItemByPath(child, path);
      if (res) {
        return res;
      }
    } else if (child.getMediaPath() === path) {
      return child;
    }
  }
};

// Sequence Helpers

export const getSequenceFromProjectItem = (item: ProjectItem) => {
  for (let i = 0; i < app.project.sequences.numSequences; i++) {
    const seq = app.project.sequences[i];
    if (seq.projectItem.nodeId === item.nodeId) {
      return seq;
    }
  }
};

export const getSequenceLengthInFrames = (seq: Sequence) => {
  const settings = seq.getSettings();
  const end = seq.end;
  const fps = settings.videoFrameRate.ticks;
  const frames = parseInt(end) / parseInt(fps);
  return frames;
};

export const forEachVideoTrack = (
  sequence: Sequence,
  callback: (track: Track, index: number) => void,
  reverse?: boolean
) => {
  const num = sequence.videoTracks.numTracks;
  if (reverse) {
    for (let i = num - 1; i > -1; i--) {
      callback(sequence.videoTracks[i], i);
    }
  } else {
    for (let i = 0; i < num; i++) {
      callback(sequence.videoTracks[i], i);
    }
  }
};

export const forEachAudioTrack = (
  sequence: Sequence,
  callback: (track: Track, index: number) => void,
  reverse?: boolean
) => {
  const num = sequence.audioTracks.numTracks;
  if (reverse) {
    for (let i = num - 1; i > -1; i--) {
      callback(sequence.audioTracks[i], i);
    }
  } else {
    for (let i = 0; i < num; i++) {
      callback(sequence.audioTracks[i], i);
    }
  }
};

export const forEachClip = (
  track: Track,
  callback: (clip: TrackItem, index: number) => void,
  reverse?: boolean
) => {
  const num = track.clips.numItems;
  if (reverse) {
    for (let i = num - 1; i > -1; i--) {
      callback(track.clips[i], i);
    }
  } else {
    for (let i = 0; i < num; i++) {
      callback(track.clips[i], i);
    }
  }
};

// Time Helpers

export const addTime = (a: Time, b: Time) => {
  const ticks = parseInt(a.ticks) + parseInt(b.ticks);
  let time = new Time();
  time.ticks = ticks.toString();
  return time;
};

export const subtractTime = (a: Time, b: Time) => {
  const ticks = parseInt(a.ticks) - parseInt(b.ticks);
  let time = new Time();
  time.ticks = ticks.toString();
  return time;
};
export const multiplyTime = (a: Time, factor: number) => {
  const ticks = parseInt(a.ticks) * factor;
  let time = new Time();
  time.ticks = ticks.toString();
  return time;
};
export const divideTime = (a: Time, factor: number) => {
  const ticks = parseInt(a.ticks) / factor;
  let time = new Time();
  time.ticks = ticks.toString();
  return time;
};

export const ticksToTime = (ticks: string) => {
  let time = new Time();
  time.ticks = ticks;
  return time;
};

const fpsTicksTable: { [key: number]: number } = {
  23.976: 10594584000,
  24: 10584000000,
  25: 10160640000,
  29.97: 8475667200,
  30: 8467200000,
  50: 5080320000,
  59.94: 4237833600,
  60: 4233600000,
};

export const getItemFrameRate = (item: ProjectItem) => {
  if (item.isSequence()) {
    const sequence = getSequenceFromProjectItem(item);
    if (sequence) {
      return 1 / sequence.getSettings().videoFrameRate.seconds;
    }
  } else {
    const key = "Column.Intrinsic.MediaTimebase";
    const mediaTimeBase = getPrMetadata(item, [key]);
    return parseFloat(mediaTimeBase[key]);
  }
};

export const getItemDuration = (item: ProjectItem) => {
  const key = "Column.Intrinsic.MediaDuration";
  const res = getPrMetadata(item, [key]);
  return parseFloat(res[key]);
};

export const getFPSTime = (fps: number) => {
  let time = new Time();
  let ticks = fpsTicksTable[fps];
  if (!ticks) return false;
  time.ticks = ticks.toString();
  return time;
};

export const ticksToFrames = (ticks: string, timebase: string) => {
  const timebaseNum = parseInt(timebase);
  return parseInt(ticks) / timebaseNum;
};

export const timecodeToSeconds = (timecode: string, frameRate: number) => {
  const segments = timecode.split(":");
  const hours = parseInt(segments[0]);
  const minutes = parseInt(segments[1]);
  const seconds = parseInt(segments[2]);
  const frames = parseInt(segments[3]);
  return hours * 3600 + minutes * 60 + seconds + frames / frameRate;
};

export const timecodeToTicks = (timecode: string, frameRate: number) => {
  const segments = timecode.split(":");
  const hours = parseInt(segments[0]);
  const minutes = parseInt(segments[1]);
  const seconds = parseInt(segments[2]);
  const frames = parseInt(segments[3]);
  const totalSeconds =
    hours * 3600 + minutes * 60 + seconds + frames / frameRate;
  const ticks = totalSeconds * 10000000; // 1 second = 10,000,000 ticks
  return Math.round(ticks);
};

export const secondsToTime = (seconds: number) => {
  let time = new Time();
  time.seconds = seconds;
  return time;
};

export const getTimecode = (
  t: Time,
  frameRateTime: Time,
  videoDisplayFormat: number
) => {
  const timecode = t.getFormatted(frameRateTime, videoDisplayFormat) as string;
  return timecode;
};

export const getTimecodeFromSequence = (t: Time, sequence: Sequence) => {
  return getTimecode(
    t,
    sequence.getSettings().videoFrameRate,
    sequence.getSettings().videoDisplayFormat
  );
};

// QE DOM Methods

export const qeGetClipAt = (track: Track, index: number) => {
  let curClipIndex = -1;
  for (let i = 0; i < track.numItems; i++) {
    const item = track.getItemAt(i);
    //@ts-ignore
    const type = item.type as "Empty" | "Clip";
    if (type === "Clip") {
      curClipIndex++;
      if (curClipIndex === index) {
        return item;
      }
    }
  }
};

// QE DOM doesn't understand some format, so this function so we convert to compatible ones
export const qeSafeTimeDisplayFormat = (timeDisplayFormat: number) => {
  const conversionTable: {
    [key: number]: number;
  } = {
    998: 110, // 23.89 > 23.976
  };
  const match = conversionTable[timeDisplayFormat];
  return match ? match : timeDisplayFormat;
};

// Metadata Helpers

export const getPrMetadata = (projectItem: ProjectItem, fields: string[]) => {
  let PProMetaURI = "http://ns.adobe.com/premierePrivateProjectMetaData/1.0/";
  if (ExternalObject.AdobeXMPScript === undefined) {
    ExternalObject.AdobeXMPScript = new ExternalObject("lib:AdobeXMPScript");
  }
  if (!app.isDocumentOpen() || !ExternalObject.AdobeXMPScript || !XMPMeta) {
    return {};
  }
  let xmp = new XMPMeta(projectItem.getProjectMetadata());
  let result: {
    [key: string]: string;
  } = {};
  for (let i = 0; i < fields.length; i++) {
    if (xmp.doesPropertyExist(PProMetaURI, fields[i])) {
      result[fields[i]] = xmp.getProperty(PProMetaURI, fields[i]).value;
    }
  }
  return result;
};

export const setPrMetadata = (
  projectItem: ProjectItem,
  data: {
    fieldName: string;
    fieldId: string;
    value: string;
  }[]
) => {
  let PProMetaURI = "http://ns.adobe.com/premierePrivateProjectMetaData/1.0/";
  if (ExternalObject.AdobeXMPScript === undefined) {
    ExternalObject.AdobeXMPScript = new ExternalObject("lib:AdobeXMPScript");
  }
  if (!app.isDocumentOpen() || !ExternalObject.AdobeXMPScript || !XMPMeta) {
    return {};
  }
  let xmp = new XMPMeta(projectItem.getProjectMetadata());
  for (var i = 0; i < data.length; i++) {
    let item = data[i];
    var successfullyAdded = app.project.addPropertyToProjectMetadataSchema(
      item.fieldName,
      item.fieldId,
      2
    );
  }
  var array = [];
  for (var i = 0; i < data.length; i++) {
    let item = data[i];
    xmp.setProperty(PProMetaURI, item.fieldName, item.value);
    array.push(item.fieldName);
  }
  var str = xmp.serialize();
  projectItem.setProjectMetadata(str, array);
};

export const removePrMetadata = (
  projectItem: ProjectItem,
  fields: string[]
) => {
  let PProMetaURI = "http://ns.adobe.com/premierePrivateProjectMetaData/1.0/";
  if (ExternalObject.AdobeXMPScript === undefined) {
    ExternalObject.AdobeXMPScript = new ExternalObject("lib:AdobeXMPScript");
  }
  if (!app.isDocumentOpen() || !ExternalObject.AdobeXMPScript || !XMPMeta) {
    return {};
  }
  let xmp = new XMPMeta(projectItem.getProjectMetadata());
  var array = [];
  for (var i = 0; i < fields.length; i++) {
    xmp.deleteProperty(PProMetaURI, fields[i]);
    array.push(fields[i]);
  }
  var str = xmp.serialize();
  projectItem.setProjectMetadata(str, array);
};

// Motion Graphics Template ( MOGRT ) Helpers

export const fillMogrtText = (
  clip: TrackItem,
  propName: string,
  text: string
) => {
  const mgt = clip.getMGTComponent();
  const prop = mgt.properties.getParamForDisplayName(propName);
  if (prop) {
    const valueStr = prop.getValue();
    let value = JSON.parse(valueStr) as any;
    value.textEditValue = text;
    prop.setValue(JSON.stringify(value), true);
  }
};

// Audio Conversions

export const dbToDec = (x: number) => Math.pow(10, (x - 15) / 20);

export const decToDb = (x: number) => 20 * Math.log(x) * Math.LOG10E + 15;
