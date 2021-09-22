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
  console.log('props', props)
  const { requestForIntros } = props

  return (
    <>
      <Card className="card-box mb-spacing-6-x2">
        <div className="card-header">
          <div className="card-header--title">
            <small>Your Requests For Introductions</small>
            <b>These are all request for introductions that you have made</b>
          </div>
        </div>
        <CardContent className="p-0">
          <div className="table-responsive-md">
            <Table className="table table-hover table-striped text-nowrap mb-0">
              <thead className="thead-light">
                <tr>
                  <th style={{ width: '40%' }}>Description</th>
                  <th className="d-flex justify-content-center align-items-center">Introductions Made</th>
                  <th>Request Status</th>
                  <th>Created</th>
                  <th>&nbsp;</th>
                </tr>
              </thead>
              <tbody>
                {
                  !requestForIntros ?
                    <tr>
                      <td>No requests for introductions yet</td>
                    </tr> :
                    requestForIntros.map(requestForIntro => {
                      return(
                        <tr key={requestForIntro.id}>
                          <td>
                            <div>
                              <div>
                                {requestForIntro.description.length > 50 ? `${requestForIntro.description.substring(1, 50)}...` : requestForIntro.description}
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="d-flex justify-content-center align-items-center">
                              <div>
                                {requestForIntro.introductions_count}
                              </div>
                            </div>
                          </td>
                          <td>
                            {
                              requestForIntro.closed ?
                                <div className={`badge badge-danger h-auto py-0 px-3`}>
                                  Closed&nbsp;{<Moment format="MM/DD/YYYY">{requestForIntro.closed_at}</Moment>}
                                </div> :
                                <div className={`badge badge-success h-auto py-0 px-3`}>
                                  Open
                                </div>
                            }
                          </td>
                          <td>
                            {<Moment format="MM/DD/YYYY">{requestForIntro.created_at}</Moment>}
                          </td>
                          <td>
                            <div>
                              <Link to={`/request-for-introductions/${requestForIntro.id}`}>
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
