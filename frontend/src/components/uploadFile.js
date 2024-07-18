import React, { useState } from 'react';

// Import React FilePond
import { FilePond, registerPlugin } from 'react-filepond';

// Import FilePond styles
import 'filepond/dist/filepond.min.css';

// Import the Image EXIF Orientation and Image Preview plugins
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import FilePondPluginFileEncode from 'filepond-plugin-file-encode';
import FilePondPluginImageTransform from 'filepond-plugin-image-transform';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginImageResize from 'filepond-plugin-image-resize';
import FilePondPluginImageCrop from 'filepond-plugin-image-crop';

import { Box, Button } from '@chakra-ui/react';

// Register the plugins
registerPlugin(
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview,
  FilePondPluginFileEncode,
  FilePondPluginFileValidateSize,
  FilePondPluginFileValidateType,
  FilePondPluginImageResize,
  FilePondPluginImageCrop,
  FilePondPluginImageTransform
);

export default function FilePondComponent() {
  const [files, setFiles] = useState([]);
  let pondRef = null;

  const onSubmit = () => {
    if (pondRef) {
      const files = pondRef.getFiles();
      files.forEach(file => {
        console.log('each file', file, file.getFileEncodeBase64String());
      });

      pondRef
        .processFiles(files)
        .then(res => console.log(res))
        .catch(error => console.log('err', error));
    }
  };

  return (
    <Box height="auto">
      <div className="App">
        <FilePond
          files={files}
          ref={ref => {
            pondRef = ref;
          }}
          required
          acceptedFileTypes={['application/pdf', 'image/*']}
          fileValidateTypeDetectType={(source, type) =>
            new Promise((resolve, reject) => {
              resolve(type);
            })
          }
          allowFileEncode
          allowImageTransform
          imagePreviewHeight={400}
          imageCropAspectRatio={'1:1'}
          imageResizeTargetWidth={100}
          imageResizeTargetHeight={100}
          imageResizeMode={'cover'}
          imageTransformOutputQuality={50}
          imageTransformOutputQualityMode="optional"
          imageTransformBeforeCreateBlob={canvas =>
            new Promise(resolve => {
              const ctx = canvas.getContext('2d');
              ctx.font = '48px serif';
              ctx.fillText('Hello world', 10, 50);
              resolve(canvas);
            })
          }
          imageTransformAfterCreateBlob={blob =>
            new Promise(resolve => {
              resolve(blob);
            })
          }
          onupdatefiles={fileItems => {
            setFiles(fileItems.map(fileItem => fileItem.file));
          }}
          instantUpload={false}
          allowMultiple={false}
          maxFiles={1}
          server="https://httpbin.org/post"
          name="files"
          labelIdle='Drag & Drop your Image or <span class="filepond--label-action">Browse</span>'
        />
        <Box display="flex" justifyContent="center">
          <Button onClick={onSubmit} variant="outline" colorScheme="blue">Submit</Button>
        </Box>
      </div>
    </Box>
  );
}
