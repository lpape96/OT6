import React, { useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import LoadingSpinner from '../common/LoadingSpinner';
import ImportFile from './ImportFile';
import userService from '../../api/user';
import { useUsersDataContext } from '../UsersDataContext/store';
import usePopMessage from '../PopMessages/usePopMessage';

interface IProps {
  isDropzoneVisible: boolean;
  setIsDropzoneVisible: (bool: boolean) => void;
}

const ImportModal = ({ isDropzoneVisible, setIsDropzoneVisible }: IProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [file, setFile] = useState<File | undefined>();
  const { dispatch } = useUsersDataContext();
  const popMessage = usePopMessage();

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
        dispatch({
          type: 'addUser',
          value: [
            {
              latHome: result.res[1].lat,
              longHome: result.res[1].long,
              latWork: result.res[0].lat,
              longWork: result.res[0].long,
              poi: result.poi,
              trace: result.trace,
              userName: file.name,
              covoit: undefined,
            },
          ],
        });
        popMessage.success('Informations utilisateur bien importées');
      } catch (e) {
        popMessage.error(
          "Erreur lors de l'import des informations utilisateur"
        );
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
