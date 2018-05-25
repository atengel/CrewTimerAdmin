import React, { Component } from 'react';
import Util from './Util';
import * as Names from './Names';
import LoadingIndicator from './LoadingIndicator';
import RegattaConfigurationForm from './forms/RegattaConfigurationForm';
class RegattaEdit extends Component {
    constructor(props) {
        super(props);

        this.state = {
            regatta: null,
            config: null,
            testingUrl: false,
            testingStatus: ''
        };
        this.onCancel = () => {
            this.props.history.replace('/');
        }
        this.onSubmit = (newConfig) => {
            // Only keep specified fields
            let data = {};
            for (let i=0; i < Names.REGATTA_CONFIG_FIELDS.length; i++) {
                let key = Names.REGATTA_CONFIG_FIELDS[i];
                if (newConfig[key] === undefined) continue;
                data[key] = newConfig[key];
            }
            let regatta = this.state.regatta;
            const newRegatta = regatta==='new';
            if (newRegatta) {
                regatta = Util.createRegattaId();
                data[Names.N_OWNER] = Util.getUser().email;
                data[Names.N_UID] = Util.getUser().uid;
                data[Names.N_NAME] = regatta.substring(0,4)+'.'+regatta.substring(4);
            }
            let csvdate = new Date().toISOString();
            data[Names.N_CSV_TIMESTAMP] = csvdate;
            Util.setRegattaConfig(regatta, data).then(() => {
                if (newRegatta) {
                    Util.reloadCsv(regatta);
                }
            });

            this.props.history.replace('/');

        }

        this.onTestUrl = (config) => {
            const regatta = config[Names.N_NAME];
            console.log('testing regatta ',regatta, ' ', config[Names.N_DOC_URL]);
            Util.reloadCsv(regatta, config[Names.N_DOC_URL]).then((result)=>{
                const status = result['status'];
                console.log("result: ",status);
                this.setState({testingUrl:false, testingStatus: status});
                return result;
            }).catch((reason) => {
                console.log("fail: ",reason);
                this.setState({testingUrl:false, testingStatus: reason});
            });
            this.setState({testingUrl:true});
        }
    }

    render() {
        if (this.state.regatta) {

            return (
                <div style={{ width: '100%', maxWidth: 700, margin: 'auto' }}>
                    <RegattaConfigurationForm 
                        onSubmit={this.onSubmit}
                        onCancel={this.onCancel}
                        onTestUrl={this.onTestUrl}
                        testingUrl={this.state.testingUrl}
                        testingStatus={this.state.testingStatus}
                        Title={this.state.config.Title} 
                        Date={this.state.config.Date} 
                        Name={this.state.config.Name} 
                        RaceType={this.state.config.RaceType} 
                        HandicapType={this.state.config.HandicapType} 
                        HandicapMultiplier={this.state.config.HandicapMultiplier} 
                        MobileKey={this.state.config.MobileKey} 
                        DocUrl={this.state.config.DocUrl} 
                        InfoText={this.state.config.InfoText} 
                        Public={this.state.config.Public} 
                        Finished={this.state.config.Finished}
                        CustomCodes={this.state.config.CustomCodes}
                        Waypoints={this.state.config.Waypoints}
                        ResultWaypoints={this.state.config.ResultWaypoints} />
                </div>
            )
        } else {
            return <LoadingIndicator />;
        }
    }

    componentWillMount() {
        let fields = this.props.location.pathname.split('/');
        let regatta = null;
        if (fields.length >= 3) {
            regatta = fields[2];
            if (regatta === 'new') {
                let data = {};
                for (let i=0; i < Names.REGATTA_CONFIG_FIELDS.length; i++) {
                    data[Names.REGATTA_CONFIG_FIELDS[i]] = "";
                }
                data[Names.N_DATE] = new Date().toISOString().substring(0,10);
                data[Names.N_NAME] = regatta;
                data[Names.N_MOBILE_PIN] = '' + (10000+Math.trunc(Math.random()*90000));
                data[Names.N_RACE_TYPE] = Names.N_RACE_TYPE_HEAD;
                data[Names.N_HANDICAP_TYPE] = Names.N_HANDICAP_NONE;
                data[Names.N_HANDICAP_MULTIPLIER] = "1";
                data[Names.N_DOC_URL] = "https://docs.google.com/spreadsheets/d/1K2UWYS9Vfb4HlHtMGRi5pGRWj4CM9ZrKNbWo58vdvh4/edit?usp=sharing";
                setTimeout(function(){
                    this.setState({regatta: regatta, config: data});
                }.bind(this), 16);
            } else {
                Util.getRegattaConfig(regatta).then((data) => {
                    this.setState({ regatta: regatta, config: data });
                }).catch((reason) => { console.log("Error querying regatta ", reason) });
            }
        }
    }
}

export default RegattaEdit;