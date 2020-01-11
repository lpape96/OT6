import { Button } from '@material-ui/core';
import Chip from '@material-ui/core/Chip';
import AddIcon from '@material-ui/icons/Add';
import { makeStyles } from '@material-ui/styles';
import React from 'react';
import Dropzone from 'react-dropzone';
import { PRIMARY_LIGHT_COLOR } from '../theme';

const useStyles = makeStyles(() => ({
  dropzone: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: '1px dashed',
    backgroundColor: '#ebebeb',
    cursor: 'pointer',
  },
}));

interface IProps {
  file?: File;
  setFile: React.Dispatch<React.SetStateAction<File | undefined>>;
}

const ImportDropzone = ({ file, setFile }: IProps) => {
  const classes = useStyles();

  const onDrop = (filesAccepted: File[]) => {
    setFile(filesAccepted[0]);
  };

  const onInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setFile(files[0]);
    }
  };

  const onRemove = () => {
    setFile(undefined);
  };

  return (
    <Dropzone
      onDrop={onDrop}
      disabled={file !== undefined}
      accept=".xls, .xlsx, .xlsm, .csv, .jpg"
    >
      {({ getRootProps, getInputProps, isDragActive }: any) => {
        return (
          <div {...getRootProps()} className={classes.dropzone}>
            <input {...getInputProps()} type="file" name="file" />
            {isDragActive ? (
              !file && <p>Faites glisser le fichier ici</p>
            ) : (
              <div>
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    width: 400,
                  }}
                >
                  {!file && (
                    <>
                      <Button
                        aria-label="Add"
                        variant="contained"
                        component="span"
                        disabled={file !== undefined}
                        style={{
                          marginRight: '30px',
                          backgroundColor: PRIMARY_LIGHT_COLOR,
                        }}
                      >
                        <AddIcon />
                      </Button>
                      <p style={{ alignSelf: 'center', marginLeft: '20 px' }}>
                        Chargez ou faites glisser un fichier ici
                      </p>
                    </>
                  )}
                  <input
                    type="file"
                    onChange={onInput}
                    id="importProfil"
                    name="importProfil"
                    disabled={file !== undefined}
                    style={{ display: 'none' }}
                  />
                  {file && (
                    <Chip
                      style={{
                        display: 'flex',
                        alignSelf: 'center',
                        fontSize: 15,
                      }}
                      color="secondary"
                      label={
                        file &&
                        (file.name.length < 40
                          ? file.name
                          : file.name.slice(0, 39) + '...')
                      }
                      onDelete={onRemove}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        );
      }}
    </Dropzone>
  );
};

export default ImportDropzone;
