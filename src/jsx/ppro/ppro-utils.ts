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
