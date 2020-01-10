import React, { useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import LoadingSpinner from '../common/LoadingSpinner';
import ImportFile from './ImportFile';
import userService from '../../api/user';

interface IProps {
  isDropzoneVisible: boolean;
  setIsDropzoneVisible: (bool: boolean) => void;
}

const ImportModal = ({ isDropzoneVisible, setIsDropzoneVisible }: IProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [file, setFile] = useState<File | undefined>();
  const [importResult, setImportResult] = useState<any | undefined>();

  const handleClose = () => {
    setIsDropzoneVisible(false);
    setLoading(false);
    setFile(undefined);
  };

  const handleImport = async () => {
    if (file) {
      try {
        setLoading(true);
        const data = new FormData();
        data.append('file', file);
        data.append('filename', file.name);
        const result = await userService.postUserLogs(data);
        setImportResult(result);
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
        console.log(importResult);
      }
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
