import { Outlet } from "react-router-dom";
import SideNavBar from "../components/SideNavBar";

const RootLayout = () => {
    return(
        <div className="app-layout" style={{display: 'flex', height: '90vh'}}>
            <SideNavBar />
            <main style={{flex: 1, padding: 20}}>
                <Outlet />
            </main>
        </div>
    );
};

export default RootLayout;