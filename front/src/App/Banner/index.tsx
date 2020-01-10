import React from 'react';
import {
  Card,
  CardContent,
  FormControlLabel,
  Checkbox,
  Button,
} from '@material-ui/core';
import userService from '../../api/user';
import ImportButton from './ImportButton';

interface T {
  house: boolean;
  work: boolean;
}

interface IProps {
  checkBox: T;
  setCheckBox: (elem: T) => void;
}

const Banner = ({ checkBox, setCheckBox }: IProps) => {
  const handleChange = (name: string) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCheckBox({ ...checkBox, [name]: event.target.checked });
  };
  const handleClick = async () => {
    const res = await userService.postUserLogs({ file: 'n' });
    console.log(res);
  };

  return (
    <Card style={{ width: '400px' }} elevation={14}>
      <CardContent
        style={{
          margin: '20px 0px 0px',
        }}
      >
        <ImportButton />
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
        <Button onClick={handleClick}>Cliquez pour lancer</Button>
      </CardContent>
    </Card>
  );
};

export default Banner;
