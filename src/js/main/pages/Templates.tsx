import { flexbox } from '@mui/system';
import React from 'react'
import NavBar from '../../components/NavBar';
import SideMenu from '../../components/SideMenu';
import WMTemplates from "../../components/WMTemplates"

const WM_Templates: React.FC = () => {


    return(
        <>
            <div style={{display:"flex"}}>
                <SideMenu />
                
                <div className='templates'>
                    <WMTemplates/>
                </div>
                
                    
                
            </div>

        </>
    );

};

export default WM_Templates;