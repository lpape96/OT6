import React, { useState } from 'react';
import { ActionButton } from '../common/ActionButton';
import ImportModal from '../ImportModal';

const ImportButton = () => {
  const [isDropzoneVisible, setIsDropzoneVisible] = useState(false);

  const handleImport = () => {
    setIsDropzoneVisible(true);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <h3>Veuillez importer vos informations</h3>
      <ActionButton onClick={handleImport} color="secondary">
        Import Excel
      </ActionButton>
      <ImportModal
        isDropzoneVisible={isDropzoneVisible}
        setIsDropzoneVisible={setIsDropzoneVisible}
      />
    </div>
  );
};

export default ImportButton;
