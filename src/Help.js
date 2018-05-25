
import React, { Component } from 'react';
import Iframe from 'react-iframe';
const pageToUrl = {
    'QuickStart' : "https://docs.google.com/document/d/e/2PACX-1vTbK0Yoz4l3vUIsmLmQM_DcFuNgoMx5ytOgDiXRLtgAt1elqh3JPEBm3AxGP4lkSAsHYQDkspTGwp0m/pub?embedded=true",
    'RegattaManagement' : "https://docs.google.com/document/d/e/2PACX-1vRQMNQC-6RPTE3FF4MDLJ6Z1u1nEhfkf6nIX5loDBYfpkRTOk27OKaeSeszyTVQEmQiCCr-Kpvud7Rr/pub?embedded=true",
    'TimingTips' : "https://docs.google.com/document/d/e/2PACX-1vRGUMAYh9BNqqIxTNPkwoYytDyCQ8ra9bXnHiiEfQrS17apbgvwYKXyNUa9FBF_rzI6JQjzwl_NR6bB/pub?embedded=true",
    'DataDictionary' : "https://docs.google.com/document/d/e/2PACX-1vQw2kLII5Yt4_vZGClgBjVWWriUXc_z6hco64wqXiOH_cN31qsg1-rxsqxlhiJiFmdFrYEjCL5hGZwA/pub?embedded=true",
    'MobileAppGuide' : "https://docs.google.com/document/d/e/2PACX-1vS9qMrDwfEzCfPdcwDfQaCjqBOhVQC851iGHWS1lbSKHGikC57rt4u9rqotXF9y1dZOejKp1385B8rg/pub?embedded=true",
    'FAQ' : "https://docs.google.com/document/d/e/2PACX-1vT4IEkKu1xshLqPz5r6k1AHpmzMdSxK855VEeASW_ZzsmuikB3NHWJl3kLwgjVjDHmiJqOA5ujdoaAS/pub?embedded=true"
};
class Help extends Component {
    render() {
        let fields = this.props.location.pathname.split('/');
        let page="QuickStart";
        if (fields.length>2) {
            page=fields[2];
        }
        let url = pageToUrl[page];
        if (!url) url = pageToUrl['QuickStart'];
        return (
            <div style={{ margin: '30px' }}>
            <div className="noprint">
            <h3>Support Links</h3>
            <bl>
                <li><a href="" onTouchTap={() => this.props.history.push('/help/QuickStart')}>Quick Start</a></li>
                <li><a href="" onTouchTap={() => this.props.history.push('/help/RegattaManagement')}>Regatta Management</a></li>
                <li><a href="" onTouchTap={() => this.props.history.push('/help/TimingTips')}>Timing Tips</a></li>
                <li><a href="" onTouchTap={() => this.props.history.push('/help/DataDictionary')}>Data Dictionary</a></li>
                <li><a href="" onTouchTap={() => this.props.history.push('/help/MobileAppGuide')}>Mobile App Guide</a></li>
                <li><a href="" onTouchTap={() => this.props.history.push('/help/FAQ')}>FAQ</a></li>
            </bl>
            <br/>
            </div>
            <Iframe url={url}/>
            </div >
        );
    }
}

export default Help;