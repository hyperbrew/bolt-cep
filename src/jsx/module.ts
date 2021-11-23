export const getActiveComp = (param: number) => {
  const comp = app.project.activeItem as CompItem;
  alert(comp.name);
  return comp.name;
};
