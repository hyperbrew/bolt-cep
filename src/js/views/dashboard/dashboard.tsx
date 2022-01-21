import { useEffect, useState } from "react";
import { Box, Chip, FormGroup, makeStyles, TextField } from "@material-ui/core";
import { csi, evalES, evalFile, openLinkInBrowser, } from "../../lib/utils";
import Button from "../../components/button";
import Header from "../../components/header";
import Switch from "../../components/switch";
import Dropdown, { DropdownItem } from "../../components/dropdown";
import * as React from "react";
import { os, path, fs } from "../../lib/node";
import { waitForDebugger } from "inspector";
import { green, lightGreen } from "@material-ui/core/colors";






const useStyles = makeStyles((theme) => ({
  body: {
    backgroundColor: "#151515",
  },
  root: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    padding: theme.spacing(2, 2),
    backgroundColor: "#151515",
    color:"#999",
    fontFamily: "Montserrat"
  
  },
  selectFolder: {
    width: "100%",
    position: "relative",
    backgroundColor: "#fff",
    borderRadius: "6px",
    marginTop: "9px",
  },
  selectFolderField: {
    width: "100%",
    color:"#000000",
    borderRadius: "6px",
    
  },
  selectFolderButton: { 
    position: "absolute",
    right: 0,
    top: 0,
    color: "#000",
    backgroundColor: "#999",
    width: "100px",
    height: "100%",
    zIndex: 2,
    borderRadius: "0px 6px 6px 0px",
    '&:hover': {
      cursor: 'pointer',
      backgroundColor: "lightGreen"
      }
  },
  selectFolderOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: 0,
    border: 0,
    cursor: "pointer",
    borderRadius: "6px",
    opacity: "10%"
  },
  item: {
    marginBottom: theme.spacing(2),
    width: "100%",
    color: "#FFF"
  },
  boxTags: {
    color: "#333",
    padding: theme.spacing(2, 0, 2, 0),
    
  },
  tag: {
    color: "#333",
    margin: theme.spacing(2, 2, 2, 0),
    backgroundColor: "#FFF"
  },
  tagsField: {
    width: "100%",
    marginTop: "9px",
    backgroundColor: "#fff",
    borderRadius: "6px",
    borderStyle: "none",
    '&:hover': {
      backgroundColor: "#fff",
      borderStyle: "none",
      }
  },
  myBtn:{
    color: "#000",
    backgroundColor: "#999",
    marginBottom: "30px",
    '&:hover': {
      cursor: 'pointer',
      backgroundColor: "lightGreen",
      borderColor: "#999"
      }
   
  },
  toggle: {
    
    '& .Mui-checked': {
        color: 'lightGreen',
      
    },
    '& .MuiSwitch-track': {
      backgroundColor:'#666',

    },
    
    
  },

}));

export interface UploadScreenProps {}

let selectedFolder = "Mostrar a última pasta utilizada pelo script"
let extraInfo = "extraInfo default";
let extraInfoSTR = "extraInfoSTR default";
let tempDir = "temDir default";
// let jsonString = "jsonString default";


const Dashboard = () => {
  const [count, setCount] = useState(0);

  function jsxTest() {
    console.log(evalES(`helloWorld("${csi.getApplicationID()}")`));
  }

  function tempFolder() {
    evalES(`selectFolder("${csi.getApplicationID()}")`).then(result => {
      selectedFolder = result;
    setTempPath(selectedFolder);
    // console.log(`Export path is: ${result}`)
    });
  }


  function _exportMogrt() {
    let dashBoardInfo = [];

    // generates a UI for the upload.
    const { v4: uuidv4 } = require('uuid');
    const thisID = uuidv4(); // ⇨ '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'
    
    evalES(`renameAndOpenInEssentialGraphicsPanel("${csi.getApplicationID()}")`);
    evalES(`exportTempFile("${csi.getApplicationID()}")`);
    evalES(`organizeAssetsFolder("${csi.getApplicationID()}")`);
    evalES(`exportMogrt("${csi.getApplicationID()}")`)
    .then(   result => {  

      let paths = JSON.parse(result)   
      
      tempDir = selectedFolder + "/" + (paths.activeItemName);
      // console.log(`tempDir is = ${tempDir}`)

      const unzipper = require("unzipper"); 
      // console.log("Extracting ZIP");
      // fs.createReadStream(paths.exportedZipPath)
      // .pipe(unzipper.Extract({ path: tempDir }))    
      const zipPath = paths.activeItemName;
      const destPath = tempDir;

      const unzip = async () => {
        await fs
          .createReadStream(paths.exportedZipPath)
          .pipe(unzipper.Extract({ path: tempDir }))
          .promise();
        console.log("unzip done!");  
        fs.readFile( tempDir+ "/definition.json", 'utf8', (err, jsonString) => {
        if (err) {

          console.log(err)
          return;
        }
        try {
          extraInfo = JSON.parse(jsonString);
          extraInfoSTR = jsonString;

        } catch (err) {
          console.log('Error parsing JSON string:', err);
        }
      })

      // the lines above is not ready in the moment I try to read a .json file inside .zip      
      fs.readFile( tempDir+ "/definition.json", 'utf8', (err, jsonString) => {
        if (err) {
          console.log("ERR on read ???");
          console.log(err)
          return;
        }
        try {
          extraInfo = JSON.parse(jsonString);
          extraInfoSTR = jsonString;

        } catch (err) {
          console.log('Error parsing JSON string:', err);
        }
      })

      // Collect all data required to fill the Template data Object in
      evalES(`getUploadInfo("${thisID}", "${channel}", "${category}", "${subcategory}", "${fileExtension}", "${afterEffectsCompatible}", "${premiereProCompatible}", "${reponsiveResize}", "${collapseTransformations}", "${renameInternalComps}", "${renameControls}", "${transferMode}", "${tags}")` ).then(   result => {
        let _getUploadInfo = JSON.parse(result);
        _getUploadInfo.extraInfo = extraInfo;
        console.log(_getUploadInfo);

        });


      };

      unzip();  


    })
      

      evalES(`reOpenOriginal("${csi.getApplicationID()}")`);
      evalES(`deleteTempFolder("${csi.getApplicationID()}")`);
      
  }
    
    
    
  
  
    
  

  useEffect(() => {
    if (window.cep) {
      console.log(`${csi.getSystemPath("extension")}/jsx/index.js`);
      evalFile(`${csi.getSystemPath("extension")}/jsx/index.js`).then(() => {});
    }
  }, []);

  const classes = useStyles();
  const[exportPath, setTempPath] = React.useState("");
  const [channel, setChannel] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [subcategory, setSubcategory] = React.useState("");
  const [fileExtension, setFileExtension] = React.useState("");
  const [afterEffectsCompatible, setAfterEffectsCompatible] = React.useState(false);
  const [premiereProCompatible, setPremiereProCompatible] = React.useState(false);
  const [reponsiveResize, setResponsiveResize] = React.useState(false);
  const [collapseTransformations, setCollapseTransformations] = React.useState(false);
  const [renameInternalComps, setRenameInternalComps] = React.useState(false);
  const [renameControls, setRenameControls] = React.useState(false);
  const [transferMode, setTransferMode] = React.useState("");
  const [tags, setTags] = React.useState<string[]>([]);
  const [tag, setTag] = React.useState("");

  const _changeExportPath = (event: any) => {
    setTempPath(event.target.value);
    setChannel("");
    setCategory("");
    setSubcategory("");
    setFileExtension("");

  };

  const _changeChannel = (event: any) => {
    setChannel(event.target.value);
    setCategory("");
    setSubcategory("");
    setFileExtension("");
  };

  const _changeCategory = (event: any) => {
    setCategory(event.target.value);
    setSubcategory("");
    setFileExtension("");
  };

  const _changeSubcategory = (event: any) => {
    setSubcategory(event.target.value);
    setFileExtension("");
  };
 
  const _changeFileExtension = (event: any) => {
    setFileExtension(event.target.value);
  };

  const _changeTransferMode = (event: any) => {
    setTransferMode(event.target.value);
  };

  const _tagsKeyPress = (event: any) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (tag.trim().length > 0) {
        setTags([...tags, tag]);
        setTag("");
      }
    }
  };

  const _removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };


  const channels: DropdownItem[] = [
    {
      label: "Channel 1 - Available from Brainstorm App",
      value: "Channel 1 Name or entity ID ???",
    },
    {
      label: "Channel 2 - Available from Brainstorm App" ,
      value: "Channel 2 Name or entity ID ???",
    },
    {
      label: "Channel 3 - Available from Brainstorm App",
      value: "Channel 3 Name or entity ID ???",
    },
  ];

  const categories: DropdownItem[] = [
    {
      label: "Category 1 - Available from Brainstorm App",
      value: "Category 1 - Name or entity Id???",
    },
    {
      label: "Category 2 - Available from Brainstorm App",
      value: "Category 2 - Name or entity Id???",
    },
    {
      label: "Category 3 - Available from Brainstorm App",
      value: "Category 3 - Name or entity Id???",
    },
  ];

  const subcategories: DropdownItem[] = [
    {
      label: "Subcategory 1 - From Category Selected Above",
      value: "SubCategory 1 - Name or entity Id???",
    },
    {
      label: "Subcategory 2 - From Category Selected Above",
      value: "SubCategory 2 - Name or entity Id???",
    },
    {
      label: "Subcategory 3 - From Category Selected Above",
      value: "SubCategory 3 - Name or entity Id???",
    },
  ];

  const fileExtensions: DropdownItem[] = [
    {
      label: "mogrt",
      value: ".mogrt",
    },
    {
      label: "aep",
      value: ".aep",
    },
    {
      label: "ffx",
      value: ".ffx",
    },
    {
      label: "mp3",
      value: ".mp3",
    },
  ];

  const transferModes: DropdownItem[] = [
    {
      label: "Transfer mode 1",
      value: "Transfer mode 1",
    },
    {
      label: "Transfer mode 2",
      value: "Transfer mode 2",
    },
    {
      label: "Transfer mode 3",
      value: "Transfer mode 3",
    },
  ];

  

  return (<>
      <div style = {{  height: '100vh', backgroundColor: "#121212"}}>
      <Header  />
      <Box className={classes.root}>
        {/* SET FOLDER LOCATION */}
        <label>Export Folder Location</label>
        <Box>
          <Box className={[classes.selectFolder, classes.item].join(" ")}>
            <TextField
              className={classes.selectFolderField}
              label = {selectedFolder}
              variant="outlined"
            />
            <Button className={classes.selectFolderButton} onClick={tempFolder}>
              SET
            </Button>
            <button className={classes.selectFolderOverlay}onClick={tempFolder} ></button>
          </Box>
        </Box>
        {/* 01 TEMPLATE METADATA */}
        <h2>01 - Template Metadata</h2>
        <Dropdown
          label="Choose Channel"
          items={channels}
          onChange={_changeChannel}
          value={channel}
        />
        {channel ? (
          <Dropdown
            label="Choose Category"
            items={categories}
            onChange={_changeCategory}
            value={category}
          />
        ) : null}
        {category ? (
          <Dropdown
            label="Choose Subcategory"
            items={subcategories}
            onChange={_changeSubcategory}
            value={subcategory}
          />
        ) : null}
        {subcategory ? (
          <Dropdown
            label="Choose File Extension"
            items={fileExtensions}
            onChange={_changeFileExtension}
            value={fileExtension}
          />
        ) : null}
        {fileExtension ? (
          <>
            <FormGroup className = {classes.toggle} style={{ marginBottom: 12 }}>
              <h2>02 - Importing Options</h2>
              <Switch
              
                checked={afterEffectsCompatible}
                onChange={() =>
                  setAfterEffectsCompatible(!afterEffectsCompatible)
                }
                label="After Effects Compatible"
              />
              <Switch
                checked={premiereProCompatible}
                onChange={() =>
                  setPremiereProCompatible(!premiereProCompatible)
                }
                label="Premiere Pro Compatible"
              />
              <Switch
                checked={reponsiveResize}
                onChange={() => setResponsiveResize(!reponsiveResize)}
                label="Responsive Resize"
              />
              <Switch
                checked={collapseTransformations}
                onChange={() =>
                  setCollapseTransformations(!collapseTransformations)
                }
                label="Collapse Transformations"
              />
              <Switch
                checked={renameInternalComps}
                onChange={() => setRenameInternalComps(!renameInternalComps)}
                label="Rename Internal Comps"
              />
              <Switch
                checked={renameControls}
                onChange={() => setRenameControls(!renameControls)}
                label="Rename Controls"
              />
            </FormGroup>
            <Dropdown
              label="Choose Transfer Mode"
              items={transferModes}
              onChange={_changeTransferMode}
              value={transferMode}
            />
            
            <label>Tags - Type {"&"} Press Enter</label>
            <TextField
              
              className={classes.tagsField}
              variant="outlined"
              value={tag}
              onChange={(event) => setTag(event.target.value)}
              onKeyPress={_tagsKeyPress}
              margin="normal"
          
          
              
            />
            <Box className={classes.boxTags}>
              {tags.map((tag: string, index: number) => (
                <Chip
                  key={`tag_${index}`}
                  className={classes.tag}
                  label={tag}
                  variant="outlined"
                  clickable
                  onDelete={() => _removeTag(tag)}
                />
              ))}
            </Box>
            <Button className={classes.myBtn } onClick={_exportMogrt}> EXPORT TEMPLATE</Button>

            
          </>
          
        ) : null}
      </Box>
      </div>
    </>
    
  );
};

export default Dashboard;
