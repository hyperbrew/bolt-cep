import React from "react";
import { Grid } from "./styles";
import SideMenu from "../SideMenu";
import WMHeader from "../WMHeader";
import WMTemplates from "../WMTemplates";

const Layout: React.FC = () => {
    return(
        <div>
        <Grid>
            <SideMenu/>
            <WMHeader/>
            
            <WMTemplates/>
        </Grid>
        </div>
    )


};

export default Layout;