import React from "react";

import {Container} from "./styles"
import WMTopMenu from "../WMTopMenu"
import WM_Home from "../WMHome";
import WM_Templates from "../WMTemplates";
import Categories from "../Categories";
import WM_Uploader from "../WMUploader";





const WMHome: React.FC = () => {
    return(

    <Container>

        <WMTopMenu/>
        <Categories/>
        <WM_Templates/>
    </Container>

    )


};

export default WMHome;