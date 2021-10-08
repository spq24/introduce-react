import React, { useEffect, useState } from 'react';
import { useAuthState } from 'context'
import { Link } from 'react-router-dom';
import axios from 'axios';
import { PageTitle } from 'layout-components';
import DashboardAnalytics1 from '../../example-components/DashboardAnalytics/DashboardAnalytics1';
import { Table, Card, Button, Grid, CardContent, } from '@material-ui/core';
import Pagination from '@material-ui/lab/Pagination';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Avatar from '@material-ui/core/Avatar/Avatar';
import Moment from 'react-moment';
import 'moment-timezone';

export default function List(props) {
  const introductionRequests = props.introductionRequests

  return (
    <>
      <Card className="card-box mb-spacing-6-x2">
        <div className="card-header">
          <div className="card-header--title">
            <small>Introduction Requests</small>
            <b>The most recent people who have asked you to introduce them to someone in your network.</b>
          </div>
        </div>
        <CardContent className="p-0">
          <div className="table-responsive-md">
            <Table className="table table-hover table-striped text-nowrap mb-0">
              <thead className="thead-light">
                <tr>
                  <th style={{ width: '40%' }}>Who asked you to introduce them</th>
                  <th>Who they asked you to introduce them to</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>&nbsp;</th>
                </tr>
              </thead>
              <tbody>
                {
                  !introductionRequests ?
                    <tr>
                      <td>No requests made yet</td>
                    </tr> :
                    introductionRequests.map(introductionRequest => {
                      return(
                        <tr key={introductionRequest.id}>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="avatar-icon-wrapper mr-3">
                                <div className="avatar-icon">
                                  <Avatar>
                                    {introductionRequest.introduction_requester && introductionRequest.introduction_requester.first_name ? introductionRequest.introduction_requester.first_name[0] : 'NA'}
                                  </Avatar>
                                </div>
                              </div>
                              <div>
                                {
                                  introductionRequest.introduction_requester && introductionRequest.introduction_requester.first_name ?
                                    introductionRequest.introduction_requester.first_name.substring(0, 15) : null
                                }
                                &nbsp;
                                {
                                  introductionRequest.introduction_requester && introductionRequest.introduction_requester.last_name ?
                                    introductionRequest.introduction_requester.last_name.substring(0, 15) : null
                                }
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="avatar-icon-wrapper mr-3">
                                <div className="avatar-icon">
                                  <Avatar>
                                    {introductionRequest.introducee && introductionRequest.introducee.first_name ? introductionRequest.introducee.first_name[0] : 'NA'}
                                  </Avatar>
                                </div>
                              </div>
                              <div>
                                <Link to="/people/:id" className="font-weight-bold text-black">
                                  {
                                    introductionRequest.introducee && introductionRequest.introducee.first_name ?
                                      introductionRequest.introducee.first_name.substring(0, 15) : null
                                  }
                                  &nbsp;
                                  {
                                    introductionRequest.introducee && introductionRequest.introducee.last_name ?
                                      introductionRequest.introducee.last_name.substring(0, 15) : null
                                  }
                                </Link>
                              </div>
                            </div>
                          </td>

                          <td>
                            {
                              introductionRequest.status ?
                                <div className={`badge badge-${introductionRequest.status.status_color} h-auto py-0 px-3`}>
                                  {introductionRequest.status.short_status}
                                </div> : null
                            }
                          </td>
                          <td>
                            {<Moment format="MM/DD/YYYY">{introductionRequest.created_at}</Moment>}
                          </td>
                          <td>
                            <div>
                              <Link to={`/introduction-requests/${introductionRequest.id}`}>
                                <Button
                                  size="small"
                                  className="btn-primary btn-icon d-40 p-0 btn-animated-icon-sm">
                                  <FontAwesomeIcon
                                    icon={['fas', 'link']}
                                    className="font-size-lg"
                                  />
                                </Button>
                              </Link>
                            </div>
                          </td>
                        </tr>
                      )
                    })
                }
              </tbody>
            </Table>
          </div>
          <div className="divider" />
          <div className="divider" />
          <div className="p-3 d-flex justify-content-center">
            {
              props.showPagination && props.pagination ?
                <Pagination
                  className="pagination-primary"
                  onChange={props.handlePageChange}
                  count={props.pagination.total_pages} /> : null
            }
          </div>
        </CardContent>
      </Card>
    </>
  );
}
