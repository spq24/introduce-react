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


export default function List(props) {
  const introductions = props.introductions

  return (
    <>
      <Card className="card-box mb-spacing-6-x2">
        <div className="card-header">
          <div className="card-header--title">
            <small>Introductions</small>
            <b>The most recent introductions you have asked for.</b>
          </div>
        </div>
        <CardContent className="p-0">
          <div className="table-responsive-md">
            <Table className="table table-hover table-striped text-nowrap mb-0">
              <thead className="thead-light">
                <tr>
                  <th style={{ width: '40%' }}>Who you want to be introduced to</th>
                  <th>Who you asked to introduce you</th>
                  <th>Status</th>
                  <th>&nbsp;</th>
                </tr>
              </thead>
              <tbody>
                {
                  introductions.map(introduction => {
                    return(
                      <tr key={introduction.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="avatar-icon-wrapper mr-3">
                              <div className="avatar-icon">
                                <Avatar>
                                  {introduction.introducee && introduction.introducee.first_name ? introduction.introducee.first_name[0] : 'NA'}
                                </Avatar>
                              </div>
                            </div>
                            <div>
                              <Link to="/people/:id" className="font-weight-bold text-black">
                                {
                                  introduction.introducee && introduction.introducee.first_name ?
                                    introduction.introducee.first_name : null
                                }
                                &nbsp;
                                {
                                  introduction.introducee && introduction.introducee.last_name ?
                                    introduction.introducee.last_name : null
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
                                  {introduction.introducer && introduction.introducer.first_name ? introduction.introducer.first_name[0] : 'NA'}
                                </Avatar>
                              </div>
                            </div>
                            <div>
                              <Link to="/people/:id" className="font-weight-bold text-black">
                                {
                                  introduction.introducer && introduction.introducer.first_name ?
                                    introduction.introducer.first_name : null
                                }
                                &nbsp;
                                {
                                  introduction.introducer && introduction.introducer.last_name ?
                                    introduction.introducer.last_name : null
                                }
                              </Link>
                            </div>
                          </div>
                        </td>
                        <td>
                          {
                            introduction.status ?
                              <div className={`badge badge-${introduction.status.status_color} h-auto py-0 px-3`}>
                                {introduction.status.short_status}
                              </div> : null
                          }
                        </td>
                        <td>
                          <div>
                            <Link to={`/introductions/${introduction.id}`}>
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
                    count={props.pagination.total_pages} />: null
            }
          </div>
        </CardContent>
      </Card>
    </>
  );
}
