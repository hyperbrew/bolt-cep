import React from 'react'
import NavBar from '../../components/NavBar';
import SideMenu from '../../components/SideMenu';
import WMHome from '../../components/WMHome';

function WmHome() {
    return (

        <>
            <div style={{display:"flex"}}>
                <SideMenu />
                
                <div className='templates'>
                    <WMHome/>
                </div>
                
                    
                
            </div>

        </>
    );
}

export default WmHome