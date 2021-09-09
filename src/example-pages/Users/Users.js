import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { impersonate, useAuthState, useAuthDispatch } from 'context';
import { Link, useHistory } from 'react-router-dom';
import { PageTitle } from 'layout-components';
import DashboardAnalytics1 from '../../example-components/DashboardAnalytics/DashboardAnalytics1';
import { Table, Card, Button, Grid, CardContent, } from '@material-ui/core';
import Pagination from '@material-ui/lab/Pagination';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Avatar from '@material-ui/core/Avatar/Avatar';
import Moment from 'react-moment';
import 'moment-timezone';

export default function Users(props) {
  const dispatch = useAuthDispatch();
  const userDetails = useAuthState();
  const history = useHistory();
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({});
  const [pageNumber, setPageNumber] = useState(1);

  useEffect(() => {
    retrieveUsers()
  }, [])

  const retrieveUsers = () => {
    axios.get(`/api/v1/users?page=${pageNumber}`, {
      headers: userDetails.credentials
    })
      .then(response => {
        setPagination(response.data.pagination)
        setUsers(response.data.users)
      })
  }

  useEffect(() => {
    retrieveUsers()
  }, [pageNumber])

  const handlePageChange = (e, pageNumber) => {
    setPageNumber(pageNumber)
  }

  const handleImpersonate = (e, id) => {
    e.preventDefault()

    impersonate(
      dispatch,
      userDetails.user,
      id,
      userDetails.credentials
    ).then(response => {
      console.log('currentUser', localStorage.getItem('currentUser'))
      console.log('trueUser', localStorage.getItem('trueUser'))
    })
  }

  return (
    <Card className="card-box mb-spacing-6-x2">
      <div className="card-header">
        <div className="card-header--title">
          <small>Users</small>
        </div>
      </div>
      <CardContent className="p-0">
        <div className="table-responsive-md">
          <Table className="table table-hover table-striped text-nowrap mb-0">
            <thead className="thead-light">
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Created</th>
                <th>&nbsp;</th>
              </tr>
            </thead>
            <tbody>
              {
                users.map(user => {
                  return (
                    <tr key={user.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="avatar-icon-wrapper mr-3">
                            <div className="avatar-icon">
                              <Avatar>
                                {user.first_name ? user.first_name[0] : 'NA'}
                              </Avatar>
                            </div>
                          </div>
                          <div>
                            {user.first_name}&nbsp;{user.last_name}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <div>
                            {user.email}
                          </div>
                        </div>
                      </td>
                      <td>
                        {<Moment format="MM/DD/YYYY">{user.created_at}</Moment>}
                      </td>
                      <td>
                        <div className="d-flex justify-content-center">
                          <Link onClick={(e) => handleImpersonate(e, user.id) }>
                            <Button
                              size="small"
                              className="btn-info btn-icon d-40 p-0 btn-animated-icon-sm">
                              <FontAwesomeIcon
                                icon={['fas', 'user']}
                                className="font-size-lg"
                              />
                            </Button>
                          </Link>&nbsp;&nbsp;&nbsp;&nbsp;
                          <Link to={`/users/${user.id}`}>
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
          <Pagination
            className="pagination-primary"
            onChange={handlePageChange}
            count={pagination.total_pages} />
        </div>
      </CardContent>
    </Card>
  );
}
