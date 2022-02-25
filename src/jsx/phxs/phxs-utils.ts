export const getDocumentDir = () => app.activeDocument?.path.fsName;

export const getDocumentPath = () => app.activeDocument?.fullName.fsName;

export const getDocumentName = () => app.activeDocument?.name;
