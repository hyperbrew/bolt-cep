export const helloWorld = () => {
  alert("Hello from After Effects!");
  app.project.activeItem;
};

export const showAlert = (title: string, message: string) => {
  alert(title + "\n" + message);
  return "Alerted";
};
