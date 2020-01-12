import React from 'react';
import {
  Card,
  CardContent,
  FormControlLabel,
  Checkbox,
} from '@material-ui/core';
import ImportButton from './ImportButton';
import { ResType } from '../App';
import { useUsersDataContext } from '../UsersDataContext/store';
import { ActionButton } from '../common/ActionButton';

interface T {
  house: boolean;
  work: boolean;
  poi: boolean;
  trace: boolean;
}

interface IProps {
  checkBox: T;
  setCheckBox: (elem: T) => void;
}

const Banner = ({ checkBox, setCheckBox }: IProps) => {
  const { usersData } = useUsersDataContext();

  const handleChange = (name: string) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCheckBox({ ...checkBox, [name]: event.target.checked });
  };

  const handleCovoit = () => {
    console.log('in');
  };

  return (
    <Card style={{ width: '400px', overflow: 'auto' }} elevation={14}>
      <CardContent
        style={{
          margin: '20px 0px 0px',
        }}
      >
        <ImportButton />
        {usersData?.map((user: ResType) => (
          <div key={user.userName}>
            <h2>
              Informations de{" l'"}
              {user.userName.substring(0, user.userName.length - 4)}
            </h2>
            <FormControlLabel
              control={
                <Checkbox
                  checked={checkBox.house}
                  onChange={handleChange('house')}
                  value="house"
                  color="secondary"
                />
              }
              label="Afficher votre logement"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={checkBox.work}
                  onChange={handleChange('work')}
                  value="work"
                  color="secondary"
                />
              }
              label="Afficher votre lieu de travail"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={checkBox.poi}
                  onChange={handleChange('poi')}
                  value="poi"
                  color="secondary"
                />
              }
              label="Afficher les points d'intérêts"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={checkBox.trace}
                  onChange={handleChange('trace')}
                  value="trace"
                  color="secondary"
                />
              }
              label="Afficher le chemin habituel"
            />
            <ActionButton onClick={handleCovoit} color="primary">
              Covoiturage
            </ActionButton>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default Banner;
