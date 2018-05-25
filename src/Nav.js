// https://stackoverflow.com/questions/34607841/react-router-nav-bar-example
import React from 'react';
import AppBar from 'material-ui/AppBar';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import NavigationMenu from 'material-ui/svg-icons/navigation/menu';
import Util from './Util';
import './App.css';
import logo from './logo.svg';

export default class Nav extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    handleLogout = () => {
        Util.doLogout();
    }

    onGoHomeClick = () => {
        // do something clever with history and page url
        this.props.history.replace('/');
    }

    render() {
        return (
            <AppBar
                className="AppBar"
                title="CrewTimer Regatta Admin"
                titleStyle={{ overflow: 'visible', textOverflow: 'clip' }}
                onTitleTouchTap={this.onGoHomeClick}
                onLeftIconButtonTouchTap={this.onGoHomeClick}
                showMenuIconButton={true}
                iconElementLeft={
                    <img
                        style={{ display: 'block', marginTop: 5 }}
                        src={logo}
                        alt="CrewTimer"
                        height="40"
                    />
                }
                iconElementRight={
                    <div>
                        {Util.isUserSignedIn() ?
                            <div style={{ display: 'inline-block' }}>
                                <div style={{
                                    marginRight: 15, textAlign: 'center',
                                    display: 'table-cell',
                                    verticalAlign: 'middle'
                                }}>{Util.user.email}</div>
                            </div> : null}
                        <IconMenu
                            iconButtonElement={<IconButton><NavigationMenu /></IconButton>}
                            anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
                            targetOrigin={{ horizontal: 'right', vertical: 'top' }}
                        >
                            {Util.isUserSignedIn() ?
                                <MenuItem primaryText="Logout" onTouchTap={this.handleLogout} /> : null}
                            <MenuItem primaryText="Help" onTouchTap={() => this.props.history.push('/help/QuickStart')}/>
                            <MenuItem primaryText="Contact" onTouchTap={() => this.props.history.push('/contact')}/>
                            <MenuItem primaryText="Store" onTouchTap={() => this.props.history.push('/store')}/>
                            <MenuItem primaryText="About" onTouchTap={() => this.props.history.push('/about')}/>
                        </IconMenu>
                    </div>
                } />
        );
    }
}