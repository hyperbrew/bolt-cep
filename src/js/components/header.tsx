import React from "react";

import { Box, makeStyles } from "@material-ui/core";

// @ts-ignore
import logo from "../assets/wm_logo_header.svg";
// @ts-ignore
import logoTitle from "../assets/logo_title.png";
// @ts-ignore
import logoutIcon from "../assets/ic_logout.png";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: "24px",
    flexGrow: 0,
    backgroundColor: "#272727",
    padding: theme.spacing(2, 2),
  },
  logo: {
    height: "27px",
  },
  logoTitle: {
    marginLeft: theme.spacing(2),
  },
  logoutIcon: {
    width: "18px",
    height: "15px",
    cursor: "pointer",
  },
}));

export interface HeaderProps {}

const Header = () => {
  const classes = useStyles();

  const _logout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <Box className={classes.root}>
      <Box>
        <img src={logo} alt="" className={classes.logo} />
      </Box>
      {localStorage.getItem("token") ? (
        <img
          src={logoutIcon}
          alt=""
          className={classes.logoutIcon}
          onClick={_logout}
        />
      ) : null}
    </Box>
  );
};

export default Header;
