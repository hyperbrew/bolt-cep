import React, {useCallback} from 'react';
import {useDropzone} from 'react-dropzone'
import "./styles"
import axios from 'axios';



import { Container, Button, ImageThumb } from "./styles";




const WM_Uploader: React.FC = () => {

 


    const onDrop = useCallback(acceptedFiles => {
        


        let formData = new FormData()
        formData.append('uploadedFiles', acceptedFiles)

        console.log(acceptedFiles[0])

        const optionsAxios: object = {
            method: 'PUT',
            url: 'https://storage.bunnycdn.com/sub-wm-previews/teste/'+acceptedFiles[0].name,
            headers: {
              'Content-Type': 'application/octet-stream',
              AccessKey: '2bd8d26c-6cd9-4ea5-afa815c4c8d0-e040-4b45'
            },
            data: acceptedFiles[0]
        };
          
          axios.request(optionsAxios).then(function (response) {
            console.log(response.data);
          }).catch(function (error) {
            console.error(error);
          });


      }, [])
      const {getRootProps, getInputProps, isDragActive} = useDropzone({accept: 'image/png', onDrop})


    return (
        <Container>
            <div {...getRootProps()}>
      <input {...getInputProps()} />
      {
        isDragActive ?
          <p>Drop the files here ...</p> :
          <Button>click to select thumbnail <br/> <br/> <b>(Max Size = 480x270px  ".png" only )</b> </Button>
      }
      
        </div>
        
            
            
        </Container>
    )
};

export default WM_Uploader;




