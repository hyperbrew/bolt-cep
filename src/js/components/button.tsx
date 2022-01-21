import { Button as MButton, makeStyles } from "@material-ui/core";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    color: "#000",
  },
}));

export interface ButtonProps {
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void;
}

const Button = ({ children, onClick, className }: ButtonProps) => {
  const classes = useStyles();
  return (
    <MButton
      variant="contained"
      color="primary"
      onClick={onClick}
      className={[classes.root, className || ""].join(" ")}
    >
      {children}
    </MButton>
  );
};

export default Button;
