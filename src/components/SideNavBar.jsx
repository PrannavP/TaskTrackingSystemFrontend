import { NavLink } from "react-router-dom";
import '../styles/sidenav.css';
import { IconGauge, IconList, IconUser } from '@tabler/icons-react';

const SideNavBar = () => {
    const SideNavBarItems = [
        { id: 1, url: '/', text: 'Dashboard', icon: <IconGauge size={18} stroke={1.5} /> },
        { id: 2, url: '/task', text: 'Tasks', icon: <IconList size={18} stroke={1.5} /> },
        { id: 3, url: '/profile', text: 'Profile', icon: <IconUser size={18} stroke={1.5} /> },
    ];

    return (
        <aside className="sidenav">
            <h2 className="side-nav-title">Task Tracker</h2>

            <nav>
                <ul>
                    {SideNavBarItems.map(item => (
                        <li key={item.id}>
                            <NavLink
                                to={item.url}
                                className={({isActive}) => `sidenav-link ${isActive ? 'active' : ''}`}
                            >
                                {item.icon}
                                <span className="sidenav-text">{item.text}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
};

export default SideNavBar;