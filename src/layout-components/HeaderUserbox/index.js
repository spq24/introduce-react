import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
  const [anchorEl, setAnchorEl] = useState(null);

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
              <StyledBadge
                overlap="circle"
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right'
                }}
                badgeContent=" "
                classes={{ badge: 'bg-success badge-circle border-0' }}
                variant="dot">
                <div className="avatar-icon rounded">
                  <img src={props.user.image.url} alt={`${props.user.first_name} ${props.user.last_name}`} />
                </div>
              </StyledBadge>
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
              Profile
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
