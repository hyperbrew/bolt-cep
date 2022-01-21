/// <reference path="../../node_modules/types-for-adobe/AfterEffects/18.0/index.d.ts" />


export const helloWorld = () => {
  alert("Hello from After Effects.");
};

    let orig = app.project.file;
    let abort = false;
    let selectedFolder = "/Users/rubensnobre/Library/Mobile Documents/com~apple~CloudDocs/WizzyMotion_Uploader"; // defined by user in UI. We need to store this path.
    let tempFolder = selectedFolder+"/temp/"; 

// Open Dialog to select a new Temporary Path to Export templates befor upload to Server.
export const selectFolder = () =>{
  let myfolder = Folder.selectDialog();  
  selectedFolder = myfolder.fsName.toString();
  return selectedFolder
};

// Extract all information required to fill the new Template Object to be uploaded.
export const getUploadInfo = ( UID, channel, category, subCategory, fileExtension, afterEffectsCompatible,premiereProCompatible,reponsiveResize,collapseTransformations,renameInternalComps,renameControls,transferMode,tags ) => {
abort = false;

  if (app.project.activeItem && app.project.activeItem instanceof CompItem && app.project.selection.length == 1){
  
  let maxSide = Math.max(app.project.activeItem.width, app.project.activeItem.height);
  let curResolution;
    if (maxSide < 720 ) {curResolution = "Low Resolution"}
    else if (maxSide >= 720 && maxSide < 1280 ) {curResolution = "SD"}
    else if (maxSide >= 1280 && maxSide < 1920) {curResolution = "HD"}
    else if (maxSide >= 1920  && maxSide < 3840) {curResolution = "Full HD"}
    else if (maxSide >= 3840  && maxSide < 7680) {curResolution = "4K"}
    else if (maxSide >= 7680 ) {curResolution = "8K+"}
  
  let curAspect = app.project.activeItem.width / app.project.activeItem.height;
  let curOrientation;
    if (curAspect == 1 ) {curOrientation = "square"}
    else if (curAspect > 1) {curOrientation = "horizontal"}
    else if (curAspect < 1) {curOrientation = "vertical"}
  var curAeMinimumHost, curPproMinimumHost;
  var versionInt = parseInt(app.version);
    if(versionInt >= 17 && versionInt < 18){curAeMinimumHost = 17; curPproMinimumHost = 14;};
    if(versionInt >= 18 && versionInt < 19){curAeMinimumHost = 18; curPproMinimumHost = 15;};
    if(versionInt >= 19 ){curAeMinimumHost = versionInt; curPproMinimumHost = versionInt;};   


 let uploadInfo = {
  ID: UID,
  aepFileName: app.project.file.toString(),
  mainCompName: app.project.activeItem.name,
  thisFrameRate: app.project.activeItem.frameRate,
  width : app.project.activeItem.width,// @ts-ignore
  heigth : app.project.activeItem.height,// @ts-ignore
  resolution : curResolution,
  orientation : curOrientation,
  aeMinimumHost : curAeMinimumHost,
  pproMinimumHost: curPproMinimumHost,
  isoLanguage: app.isoLanguage,
  osName : system.osName,
  osVersion : system.osVersion,
  userName : system.userName,
  machineName : system.machineName,
  
  // information from Interface/ReactSide
  channel: channel,
  category: category,
  subCategory: subCategory,
  fileExtension: fileExtension,
  afterEffectsCompatible: afterEffectsCompatible,
  premiereProCompatible: premiereProCompatible,
  responsiveResize: reponsiveResize,
  collapseTransformations: collapseTransformations,
  renameInternalComps: renameInternalComps,
  renameControls: renameControls,
  transferMode: transferMode,
  tags: tags
  };

  // alert on screen
  // alert(JSON.stringify(uploadInfo));

  return JSON.stringify(uploadInfo)

  } else { 
    abort = true;
   }

}

// Open ActiveItem to be exported in Essential Graphics Panel and rename export name to the same name on Comp.
export const renameAndOpenInEssentialGraphicsPanel = () => {
  try{

  // @ts-ignore
   orig = app.project.file;
   abort = false;

      if (app.project.activeItem && app.project.activeItem instanceof CompItem && app.project.selection.length == 1){
      // @ts-ignore
        app.project.activeItem.openInViewer();
        // Rename mogrt with same name as active Comp
        
        // @ts-ignore
        app.project.activeItem.motionGraphicsTemplateName = app.project.activeItem.name;
        // @ts-ignore
        app.project.activeItem.openInEssentialGraphics();
        app.project.save();
      } else 
        {
        abort = true;
        alert("Please select ONLY your SINGLE maincomp that contains Essential Graphics Controllers from Project panel")
        }
      }catch(err){alert(err + "01 Err at line  =  " + err.line)}
}

// save a temporary copy of original project with compname as name.
export const exportTempFile = () => {
  try{  
  if (abort != true ){
  // @ts-ignore
  if (app.project.activeItem.motionGraphicsTemplateControllerCount>=1){
    // create temp folder if it doesn't exists]
  let f = new Folder(selectedFolder.toString() + "/temp/");
      if (!f.exists)
          f.create();  
  // set aePath to full name variable      
  var aePath = selectedFolder.toString() + "/temp/" + app.project.activeItem.name+".aep";
  // save a temporary copy of original project with comp name as name.
  app.project.save(File(aePath))
  } else { abort = true; alert("Please add controllers to the Essential Graphics Panel before Export"); return false}
  }
}catch(err){alert(err + "02 Err at line  =  " + err.line)}
}

// organize Assets in order to only have 1 simple Comp and 1 single folder.
export const organizeAssetsFolder = () => {
  try{
    // @ts-ignore
    if (abort != true && app.project.activeItem.motionGraphicsTemplateControllerCount>=1){
      
  // check if @assets folder exists (create if not)
  var thisParentFolder;

  // @ts-ignore
  function checkAssetsFolder(){
  for (var i = 1; i<=app.project.numItems; i++){
      if(app.project.item(i).name === "@ Assets" && app.project.item(i) instanceof FolderItem){
          app.project.item(i).label = 2;
          thisParentFolder = app.project.item(i); return true}
      }
  }

  for (var i = 1; i<=app.project.numItems; i++){
      if(app.project.item(i).parentFolder.name === "Root" && app.project.item(i) instanceof CompItem){
          app.project.item(i).label = 9;
      }
  }

  if(checkAssetsFolder() != true){app.project.items.addFolder("@ Assets"); checkAssetsFolder();};

  for (var i = 1; i<=app.project.numItems; i++){
      if(app.project.item(i) !== app.project.activeItem && app.project.item(i) !== thisParentFolder){
          app.project.item(i).label = 10;
          app.project.item(i).parentFolder = thisParentFolder;
          }
  }
  app.project.removeUnusedFootage();

  app.project.save();
  }else { abort = true; return false}
}catch(err){alert(err + "03 Err at line  =  " + err.line)}
}

// export mogrt file & collect extra data from definition.json
export const  exportMogrt = ()=> {
  try{

  if (abort != true){
  // @ts-ignore
  if (app.project.activeItem.motionGraphicsTemplateControllerCount>=1){
     // @ts-ignore
      app.project.activeItem.motionGraphicsTemplateName = app.project.activeItem.name;
      // alert("IMPORTANT \n Please click \"OK\" if any popup regarding external fonts, dynamic Links or missing plugins appears \n \n DO NOT CLICK CANCEL OR ERRORS MAY HAPPEN");
      
      // export the .mogrt file
      // @ts-ignore
      app.project.activeItem.exportAsMotionGraphicsTemplate(true, selectedFolder);


      tempFolder = selectedFolder+"/temp/"
    
      let exportedMogrtPath = selectedFolder + "/" + app.project.activeItem.name + ".mogrt";
      let exportedMogrt = new File (exportedMogrtPath);

      // Delete previous .zip file (IF EXISTS) because raname can't overwrite a file if already exists
      let exportedZipPath = selectedFolder + "/" + app.project.activeItem.name + ".zip";
      let deletePreviousZip = File (exportedZipPath);
      deletePreviousZip.remove(); 
      
      // Rename Latest Exported from .mogrt to .zip
      let exportedZip = exportedMogrt.rename( app.project.activeItem.name + ".zip" )

      let activeItemName = app.project.activeItem.name;

      // create an extra temp folder with template name to avoid mess on delete.
      let uf = new Folder(selectedFolder.toString() + "/" + app.project.activeItem.name);
      if (!uf.exists)
      uf.create();

      return JSON.stringify({selectedFolder, exportedZipPath, activeItemName})
     
  } 
  else { abort = true; return false}
}
}catch(err){alert(err + "04 Err at line  =  " + err.line)}
}

export const reOpenOriginal = () => {
  try{
  
  if (abort != true){
      app.open(orig);
      // @ts-ignore
      app.project.activeItem.openInEssentialGraphics();
      app.project.save();
  }
}catch(err){alert(err + "05 Err at line  =  " + err.line)}
}


export const deleteTempFolder = () => {
  try{
  if (abort != true){

  
  

  var MyFile;
  var deletFolder = Folder (tempFolder.toString());
  var folderNumItems = deletFolder.getFiles().length;
  
  for (var i=folderNumItems; i>0; i-- ) {
    // @ts-ignore
       MyFile = new File (deletFolder.getFiles()[i-1]);
          MyFile.remove();
  }
  var MyFolder = new Folder (tempFolder);
  if (MyFolder.exists)
      {
          MyFolder.remove();
      }
}
}catch(err){alert(err + "06 Err at line  =  " + err.line)}
}