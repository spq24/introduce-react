import React from 'react';
import { Link } from 'react-router-dom';
import { Table, Card, Button, CardContent, } from '@material-ui/core';
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
                      <td>No proposals made yet</td>
                    </tr> :
                    introductionProposals.map(introductionProposal => {
                      return(
                        <tr key={introductionProposal.id}>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="avatar-icon-wrapper mr-3">
                                <div className="avatar-icon">
                                  <Avatar>
                                    {introductionProposal.introducee_one && introductionProposal.introducee_one.first_name ? introductionProposal.introducee_one.first_name[0] : 'NA'}
                                  </Avatar>
                                </div>
                              </div>
                              <div>
                                {
                                  introductionProposal.introducee_one && introductionProposal.introducee_one.first_name ?
                                    introductionProposal.introducee_one.first_name.substring(0, 15) : null
                                }
                                &nbsp;
                                {
                                  introductionProposal.introducee_one && introductionProposal.introducee_one.last_name ?
                                    introductionProposal.introducee_one.last_name.substring(0, 15) : null
                                }
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="avatar-icon-wrapper mr-3">
                                <div className="avatar-icon">
                                  <Avatar>
                                    {introductionProposal.introducee_two && introductionProposal.introducee_two.first_name ? introductionProposal.introducee_two.first_name[0] : 'NA'}
                                  </Avatar>
                                </div>
                              </div>
                              <div>
                                {
                                  introductionProposal.introducee && introductionProposal.introducee_two.first_name ?
                                    introductionProposal.introducee_two.first_name.substring(0, 15) : null
                                }
                                &nbsp;
                                {
                                  introductionProposal.introducee && introductionProposal.introducee_two.last_name ?
                                    introductionProposal.introducee_two.last_name.substring(0, 15) : null
                                }
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
                              <Link to={`/introduction-proposals/${introductionProposal.id}`}>
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
