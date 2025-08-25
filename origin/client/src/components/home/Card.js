import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { useHistory } from "react-router-dom";

import dataImg from '../../assets/data.jpeg'
import { CardActions } from '@material-ui/core';

const useStyles = makeStyles({
  root: {
    maxWidth: 450,
  },
  media: {
    height: 140,
  },
});

export default function MediaCard() {
  const classes = useStyles();
  const history = useHistory()

  return (
    <Card className={classes.root} onClick={() => history.push('/data')}>
      <CardActionArea>
        <CardMedia
          className={classes.media}
          image={dataImg}
          title="Données"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            Données analysées et restituées
          </Typography>
          <Typography variant="body2" color="textSecondary" component="div">
            Consulter les types de données réceptionnées et analysées par ACENA,
            ainsi que les types de données restituées après traitement.
          </Typography>
          <Button color="primary" variant="contained" style={{ marginTop: 8 }}>Consulter</Button>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}