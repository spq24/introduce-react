import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSegment } from 'react-segment-hooks';
import {
  Typography,
  Badge,
  Menu,
  Button,
  List,
  ListItem,
  Tooltip,
  Divider
} from '@material-ui/core';
import avatar7 from '../../assets/images/avatars/avatar7.jpg';
import { withStyles } from '@material-ui/core/styles';
import { createBrowserHistory } from "history";




const StyledBadge = withStyles({
  badge: {
    backgroundColor: 'var(--success)',
    color: 'var(--success)',
    boxShadow: '0 0 0 2px #fff',
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: '$ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""'
    }
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0
    }
  }
})(Badge);

const HeaderUserbox = (props) => {
  const analytics = useSegment();
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    const { user } = props
    analytics.identify({
      userId: user.id,
      traits: {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        true_user_id: props.trueUser ? props.trueUser.id : null,
        true_user: props.trueUser
      }
    })
  })

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        variant="text"
        onClick={handleClick}
        className="ml-2 btn-transition-none text-left ml-2 p-0 bg-transparent d-flex align-items-center"
        disableRipple>
        {
          props.user && props.user.image && props.user.image.url ?
            <div className="d-block p-0 avatar-icon-wrapper">
              <div className="avatar-icon rounded">
                <img src={props.image ? props.image : props.user.image.url} alt={`${props.user.first_name} ${props.user.last_name}`} />
              </div>
            </div> : null
        }

        <div className="d-none d-xl-block pl-2">
          <div className="font-weight-bold pt-2 line-height-1">{props.user.first_name} {props.user.last_name}</div>
          <span className="text-black-50">{props.user.title}</span>
        </div>
        <span className="pl-1 pl-xl-3">
          <FontAwesomeIcon icon={['fas', 'angle-down']} className="opacity-5" />
        </span>
      </Button>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
        open={Boolean(anchorEl)}
        classes={{ list: 'p-0' }}
        onClose={handleClose}>
        <div className="dropdown-menu-lg overflow-hidden p-0">
          <div className="d-flex px-3 pt-3 align-items-center justify-content-between">
            <Typography className="text-capitalize pl-1 font-weight-bold text-primary">
              <span>Actions</span>
            </Typography>
          </div>
          <List
            component="div"
            className="nav-neutral-primary text-left d-block px-3 pb-3">
            <ListItem button className="d-block text-left">
              <Link to={`/users/${props.user.id}`}>
                Profile
              </Link>
            </ListItem>
          </List>
          <Divider className="w-100" />
          <div className="d-flex py-3 justify-content-center">
            <div className="d-flex align-items-center">
              <div>
                <FontAwesomeIcon
                  icon={['fas', 'power-off']}
                  className="font-size-sm text-danger"
                />
              </div>
              <div className="pl-3 line-height-sm">
                <Link to="#" onClick={(e) => props.handleLogout(e)} className="font-size-sm">
                  Logout
                </Link>
              </div>
            </div>
          </div>
          <Divider className="w-100" />
        </div>
      </Menu>
    </>
  );
};

export default HeaderUserbox;
