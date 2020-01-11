import React from 'react';
import {
  Card,
  CardContent,
  FormControlLabel,
  Checkbox,
} from '@material-ui/core';
import ImportButton from './ImportButton';
import { ResType } from '../App';

interface T {
  house: boolean;
  work: boolean;
}

interface IProps {
  checkBox: T;
  setCheckBox: (elem: T) => void;
  usersData: ResType[] | undefined;
  setUsersData: (data: ResType[] | undefined) => void;
}

const Banner = ({ checkBox, setCheckBox, usersData, setUsersData }: IProps) => {
  const handleChange = (name: string) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCheckBox({ ...checkBox, [name]: event.target.checked });
  };

  return (
    <Card style={{ width: '400px' }} elevation={14}>
      <CardContent
        style={{
          margin: '20px 0px 0px',
        }}
      >
        <ImportButton setUsersData={setUsersData} />
        {usersData?.map((user: ResType) => (
          <div key={user.userName}>
            <h1>Informations de {user.userName}</h1>
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
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default Banner;
