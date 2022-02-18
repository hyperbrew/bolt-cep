/// <reference path="../../../node_modules/types-for-adobe/Photoshop/2015.5/index.d.ts" />

export const getDocumentDir = () => app.activeDocument?.path.fsName;

export const getDocumentPath = () => app.activeDocument?.fullName.fsName;

export const getDocumentName = () => app.activeDocument?.name;
