import React,{useState} from 'react'
import ImageUploader from 'react-images-upload';


const UploadImage =()=>{
    const [image,setImage] = useState([]);

    const onDrop=(img)=>{
        setImage(...image,img);
    }

    return (
        <ImageUploader
            singleImage = {true}
            withIcon={true}
            withPreview={true}
            buttonText='Select an image'
            onChange={this.onDrop}
            imgExtension={['.jpg', '.gif', '.png', '.gif']}
            maxFileSize={5242880}
        />
    );

}

export default ImageUploader