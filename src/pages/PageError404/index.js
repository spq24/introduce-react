import React from 'react';
import { Link } from 'react-router-dom';
import { Grid } from '@material-ui/core';
import illustration1 from 'assets/images/illustrations/pack4/404.svg';

export default function LivePreviewExample() {
  return (
    <>
    <div className="app-wrapper bg-white">
      <div className="app-main">
        <div className="app-content p-0">
          <div className="app-inner-content-layout--main">
            <div className="flex-grow-1 w-100 d-flex align-items-center">
              <div className="bg-composed-wrapper--content">
                <div className="hero-wrapper bg-composed-wrapper min-vh-100">
                  <div className="flex-grow-1 w-100 d-flex align-items-center">
                    <Grid
                      item
                      lg={6}
                      md={9}
                      className="px-4 px-lg-0 mx-auto text-center text-black">
                      <img
                        src={illustration1}
                        className="w-50 mx-auto d-block my-5 img-fluid"
                        alt="..."
                      />

                      <h3 className="font-size-xxl line-height-sm font-weight-light d-block px-3 mb-3 text-black-50">
                        The page you were looking for doesn't exist.
                        </h3>
                      <p>
                        It's on us, we probably moved the content to a
                          different page. <u><Link to="/dashboard">Go to your dashboard</Link></u>
                      </p>
                    </Grid>
                  </div>
                  <div className="hero-footer py-4"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
