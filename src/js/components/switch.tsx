import { FormControlLabel, Switch as MSwitch } from "@material-ui/core";
import React from "react";

export interface SwitchProps {
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
}

const Switch = ({ checked, onChange, label }: SwitchProps) => {
  return (
    <FormControlLabel
      control={<MSwitch checked={checked} onChange={onChange} color={'default'}/>}
      label={label}
    />
  );
};

export default Switch;
