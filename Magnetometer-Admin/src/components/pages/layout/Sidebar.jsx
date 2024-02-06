import React, { useEffect, useState } from "react";
import { Layout, Menu, Image } from "antd";
import { useNavigate } from "react-router-dom";
import {
    UsergroupAddOutlined,
    // FormOutlined,
    SettingOutlined,
    // WindowsOutlined,
    NotificationOutlined
} from '@ant-design/icons';
import logo from '../../../assets/images/magnetometer.png'

const Sidebar = () => {
    const [collapsed, setCollapsed] = useState(false);
    const { Sider } = Layout;
    const navigate = useNavigate();
    const onMenuClick = (event) => {
        const { key } = event
        navigate(key)
    }


    useEffect(() => {
        if(collapsed){
          document.body.classList.add('hasOpen')
        }
        else {
          document.body.classList.remove('hasOpen')
        }
      }, [collapsed])

    // const commonChildrenArray = [

    //     {
    //         label: 'Faqs',
    //         key: 'faq',
    //         icon: <FormOutlined />
    //     },
    // ];
    // const settingChildrenArray = [
    //     {
    //         label: 'CMS',
    //         key: 'cms',
    //         icon: <WindowsOutlined />
    //     },
    // ];


    const items = [
        // {
        //     label: 'Dashboard',
        //     key: 'dashboard',
        //     icon: <HomeOutlined />
        // },
        {
            label: 'My User',
            key: 'my-user',
            icon: <UsergroupAddOutlined />
        },
        {
            label: 'Collection',
            key: 'collection',
            icon: <UsergroupAddOutlined />,
        },
        {
            label: 'Notification',
            key: 'notification',
            icon: <NotificationOutlined />
        },
        {
            label: 'About',
            key: 'about',
            icon: <SettingOutlined />,
            // children: settingChildrenArray,
        },
    ];

    return <>
          <Sider
            style={{
                overflow: 'auto',
                height: '100vh',
                position: 'fixed',
                left: 0,
                top: 0,
                bottom: 0,
                background: "linear-gradient(50deg, #0376BC 50%, #00C4E6 100%)"
            }}
            // className="my-sidermenu-color sidebar-scroll-manage h-auto" 
            collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)} id="sidebar_scroll"
        >
            <div className="logo" >
                <Image src={logo} alt='' preview={false} />
            </div>
            <Menu
                mode="inline"
                className="my-sidermenu-color"
                onClick={onMenuClick}
                items={items}
                style={{ minWidth: 0, flex: "auto",paddingBottom:40 }}
                theme={{ textColor: '#fff' }}
            />
        </Sider>
    </>

}
export default Sidebar;