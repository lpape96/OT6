import { Button } from '@material-ui/core';
import { ButtonProps } from '@material-ui/core/Button';
import React from 'react';

export const ActionButton = (props: ButtonProps) => {
  return (
    <Button
      variant="contained"
      style={{
        margin: 8,
        fontWeight: 'bold',
        borderRadius: 100,
      }}
      {...props}
    />
  );
};

// Créer les différentes options à mettre sur la carte
