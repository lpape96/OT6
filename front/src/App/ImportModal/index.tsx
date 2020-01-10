import React, { useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import LoadingSpinner from '../common/LoadingSpinner';
import ImportFile from './ImportFile';

interface IProps {
  isDropzoneVisible: boolean;
  setIsDropzoneVisible: (bool: boolean) => void;
}

const ImportModal = ({ isDropzoneVisible, setIsDropzoneVisible }: IProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [file, setFile] = useState<File | undefined>();

  const handleClose = () => {
    setIsDropzoneVisible(false);
    setLoading(false);
    setFile(undefined);
  };

  const handleImport = () => {
    if (file) {
      console.log(`We've got the file`);
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        console.log(`It's been analysed`);
      }, 2000);
    }
  };

  return (
    <Dialog
      open={isDropzoneVisible}
      onClose={loading ? undefined : handleClose}
      maxWidth={'md'}
      fullWidth={true}
    >
      {loading && <LoadingSpinner />}
      {!loading && (
        <ImportFile
          file={file}
          setFile={setFile}
          loading={loading}
          handleClose={handleClose}
          handleImport={handleImport}
        />
      )}
    </Dialog>
  );
};

export default ImportModal;
