import React from 'react';
import { Link } from 'react-router-dom';
import { Grid, Card, Button } from '@material-ui/core';

export default function MarketingCta(props) {
  return (
    <>
    <div className="mb-spacing-6">
      <Grid container spacing={6}>
        <Grid item md={12}>
          <Card className={`card-box bg-neutral-${props.type} p-3 p-xl-4`}>
            <div className="bg-composed-wrapper--content d-block text-center text-xl-left d-xl-flex justify-content-between align-items-center">
              <p className="opacity-9 font=size-xl mr-0 mr-xl-3 mb-4 mb-xl-0">
                {props.text}
              </p>
              <Link to={props.link}>
                <Button className={`btn-${props.type} text-nowrap px-4 text-uppercase font-size-sm font-weight-bold`}>
                  {props.button}
                </Button>
              </Link>
            </div>
          </Card>
        </Grid>
      </Grid>
    </div>
    </>
  );
}
