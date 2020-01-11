import React, { useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import LoadingSpinner from '../common/LoadingSpinner';
import ImportFile from './ImportFile';
import userService from '../../api/user';
import { ResType } from '../App';

interface IProps {
  isDropzoneVisible: boolean;
  setIsDropzoneVisible: (bool: boolean) => void;
  setUsersData: (usersData: ResType[] | undefined) => void;
}

const ImportModal = ({
  isDropzoneVisible,
  setIsDropzoneVisible,
  setUsersData,
}: IProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [file, setFile] = useState<File | undefined>();

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
        setUsersData([
          {
            latHome: result[0].lat,
            longHome: result[0].long,
            latWork: result[1].lat,
            longWork: result[1].long,
            userName: file.name,
          },
        ]);
      } catch (e) {
        console.log('error', e);
      } finally {
        handleClose();
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
