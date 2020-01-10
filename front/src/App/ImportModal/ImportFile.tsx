import React from 'react';
import { DialogActions, DialogContent, makeStyles } from '@material-ui/core';
import { ActionButton } from '../common/ActionButton';
import ImportDropzone from './ImportDropzone';

const useStyles = makeStyles(() => ({
  content: {
    minHeight: 200,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'stretch',
    padding: '16px !important',
  },
}));

interface IProps {
  file?: File;
  setFile: React.Dispatch<React.SetStateAction<File | undefined>>;
  loading: boolean;
  handleClose: () => void;
  handleImport: () => void;
}

const ImportFile = ({
  file,
  setFile,
  loading,
  handleClose,
  handleImport,
}: IProps) => {
  const classes = useStyles();

  const handleClickImport = () => handleImport();

  return (
    <>
      <DialogContent className={classes.content}>
        <ImportDropzone file={file} setFile={setFile} />
      </DialogContent>
      <DialogActions style={{ display: 'flex' }}>
        <ActionButton onClick={handleClose} disabled={loading}>
          Annuler
        </ActionButton>
        <ActionButton
          color="primary"
          onClick={handleClickImport}
          disabled={!file || loading}
        >
          Importer
        </ActionButton>
      </DialogActions>
    </>
  );
};

export default ImportFile;
