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
  const { introductionProposals } = props

  return (
    <>
      <Card className="card-box mb-spacing-6-x2">
        <div className="card-header">
          <div className="card-header--title">
            <small>Introduction Proposals</small>
            <b>These are the introductions you proposed to make happen.</b>
          </div>
        </div>
        <CardContent className="p-0">
          <div className="table-responsive-md">
            <Table className="table table-hover table-striped text-nowrap mb-0">
              <thead className="thead-light">
                <tr>
                  <th style={{ width: '40%' }}>Introducee #1</th>
                  <th>Introducee #2</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>&nbsp;</th>
                </tr>
              </thead>
              <tbody>
                {
                  !introductionProposals ?
                    <tr>
                      <td>No requests made yet</td>
                    </tr> :
                    introductionProposals.map(introductionProposal => {
                      return(
                        <tr key={introductionProposal.id}>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="avatar-icon-wrapper mr-3">
                                <div className="avatar-icon">
                                  <Avatar>
                                    {introductionProposal.introduction_requester && introductionProposal.introduction_requester.first_name ? introductionProposal.introduction_requester.first_name[0] : 'NA'}
                                  </Avatar>
                                </div>
                              </div>
                              <div>
                                <Link to="/people/:id" className="font-weight-bold text-black">
                                  {
                                    introductionProposal.introduction_requester && introductionProposal.introduction_requester.first_name ?
                                      introductionProposal.introduction_requester.first_name : null
                                  }
                                  &nbsp;
                                  {
                                    introductionProposal.introduction_requester && introductionProposal.introduction_requester.last_name ?
                                      introductionProposal.introduction_requester.last_name : null
                                  }
                                </Link>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="avatar-icon-wrapper mr-3">
                                <div className="avatar-icon">
                                  <Avatar>
                                    {introductionProposal.introducee && introductionProposal.introducee.first_name ? introductionProposal.introducee.first_name[0] : 'NA'}
                                  </Avatar>
                                </div>
                              </div>
                              <div>
                                <Link to="/people/:id" className="font-weight-bold text-black">
                                  {
                                    introductionProposal.introducee && introductionProposal.introducee.first_name ?
                                      introductionProposal.introducee.first_name : null
                                  }
                                  &nbsp;
                                  {
                                    introductionProposal.introducee && introductionProposal.introducee.last_name ?
                                      introductionProposal.introducee.last_name : null
                                  }
                                </Link>
                              </div>
                            </div>
                          </td>

                          <td>
                            {
                              introductionProposal.status ?
                                <div className={`badge badge-${introductionProposal.status.status_color} h-auto py-0 px-3`}>
                                  {introductionProposal.status.short_status}
                                </div> : null
                            }
                          </td>
                          <td>
                            {<Moment format="MM/DD/YYYY">{introductionProposal.created_at}</Moment>}
                          </td>
                          <td>
                            <div>
                              <Link to={`/introduction-requests/${introductionProposal.id}`}>
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
