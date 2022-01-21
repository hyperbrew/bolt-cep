import React from "react";
import {
  Box,
  FormControl,
  makeStyles,
  MenuItem,
  Select,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    marginBottom: theme.spacing(2),
  },
  formControl: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginTop: "9px"
  },
  labelAdditional: {
    
    color: "#FF7B7B",
    marginBottom: "10px"
  },
}));

export class DropdownItem {
  value?: string;
  label?: string;
}

export interface DropdownProps {
  onChange?: (event: any) => void;
  value?: string;
  label: string;
  labelAdditional?: string;
  items: DropdownItem[];
}

const Dropdown = ({
  onChange,
  value,
  label,
  labelAdditional,
  items,
}: DropdownProps) => {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <label>
        {label}{" "}
        <span className={classes.labelAdditional}>{labelAdditional || ""}</span>
      </label>
      <FormControl variant="outlined" className={classes.formControl}>
        <Select
          labelId="demo-simple-select-outlined-label"
          id="demo-simple-select-outlined"
          value={value}
          onChange={onChange}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {items.map((item) => (
            <MenuItem
              key={`dropdown-item-${label.toLowerCase().replace(" ", "")}-${
                item.value
              }`}
              value={item.value}
            >
              {item.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default Dropdown;
