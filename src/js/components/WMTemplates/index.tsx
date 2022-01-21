import React from "react";

import {Container} from "./styles"
import WMTopMenu from "../WMTopMenu"
import WM_Home from "../WMHome";
import WM_Templates_gallery from "../WMTemplates_gallery";
import Categories from "../Categories";
import WM_Uploader from "../WMUploader";
import WMHeader from "../WMHeader";




const WMTemplates: React.FC = () => {
    return(

    <Container>
        <WMHeader/>
        <WMTopMenu/>
        <Categories/>
        <WM_Templates_gallery/>
    </Container>

    )


};

export default WMTemplates;