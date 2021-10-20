import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Grid, Card } from '@material-ui/core';

export default function NumberBoxes(props) {

  return (
    <>
      <div className="mb-spacing-6">
        <Grid container spacing={6}>
          <Grid item xl={4} md={4}>
            <Card className="card-box border-0 shadow-first-sm p-4">
              <div className="d-flex align-items-center">
                <div className="d-40 btn-icon rounded-circle bg-first text-white text-center font-size-lg mr-3">
                  <FontAwesomeIcon icon={['far', 'keyboard']} />
                </div>
                <div className="text-black-50">Introductions Asked For</div>
              </div>
              <div className="display-3 text-center line-height-sm text-second text-center d-flex align-items-center pt-3 justify-content-center">
                <div>{props.introductions ? props.introductions.length : 0}</div>
              </div>
            </Card>
          </Grid>
          <Grid item xl={4} md={4}>
            <Card className="card-box border-0 shadow-success-sm p-4">
              <div className="d-flex align-items-center">
                <div className="d-40 btn-icon rounded-circle bg-success text-white text-center font-size-lg mr-3">
                  <FontAwesomeIcon icon={['far', 'file-excel']} />
                </div>
                <div className="text-black-50">Requested Introductions</div>
              </div>
              <div className="display-3 text-center line-height-sm text-second text-center d-flex align-items-center pt-3 justify-content-center">
                <div>{props.introductionRequests ? props.introductionRequests.length : 0}</div>
              </div>
            </Card>
          </Grid>
          <Grid item xl={4} md={4}>
            <Card className="card-box border-0 shadow-danger-sm p-4">
              <div className="d-flex align-items-center">
                <div className="d-40 btn-icon rounded-circle bg-danger text-white text-center font-size-lg mr-3">
                  <FontAwesomeIcon icon={['far', 'user']} />
                </div>
                <div className="text-black-50">Proposed Introductions</div>
              </div>
              <div className="display-3 text-center line-height-sm text-second text-center d-flex align-items-center pt-3 justify-content-center">
                <div>{props.introductionProposals ? props.introductionProposals.length : 0}</div>
              </div>
            </Card>
          </Grid>
        </Grid>
      </div>
    </>
  );
}
