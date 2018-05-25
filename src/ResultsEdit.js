import React, { Component } from 'react';
import Util from './Util';
import * as Names from './Names';
import TimeUtil from './util/TimeUtil';
import ReactDOM from 'react-dom';
import LoadingIndicator from './LoadingIndicator';
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow
} from 'material-ui/Table';
import ResultsRow from './ResultsRow';

import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import fire from './fire';
const uuidv1 = require('uuid/v1');

const style = {
    add: {
        margin: 0,
        top: 'auto',
        right: 20,
        bottom: 20,
        left: 'auto',
        position: 'fixed'
    }
};
class ResultsEdit extends Component {
    constructor(props) {
        super(props);

        this.state = {
            regatta: null,
            results: null,
            config: null,
            testingUrl: false,
            testingStatus: ''
        };
        this.onChange = (row) => {
            console.log("Updating ", row);
            const lap = Object.assign({}, row);
            delete lap[Names.N_RAW_TIME];
            Util.storeLap(this.regatta, lap);
        }

    }

    onSaveClick() {
        //       Util.setRegattaConfig(this.state.regatta, this.state.config);

        this.props.history.replace('/');
    }

    onAddResult = () => {
        let event = {}
        event[Names.N_UUID] = uuidv1();
        event[Names.N_FLIGHT] = '1';
        event[Names.N_EVENTNUM] = '?';
        event[Names.N_BOW] = '?';
        event[Names.N_GATE] = '?';
        event[Names.N_CREW] = '?';

        let d = new Date();
        let milli = d.getHours() * 3600 * 1000;
        milli += d.getMinutes() * 60 * 1000;
        milli += d.getSeconds() * 1000;
        milli += d.getMilliseconds();
        event[Names.N_TIME] = TimeUtil.milliToString(milli);
        this.needsScrollToEnd = true;
        Util.storeLap(this.regatta, event);

    }

    _rxFirebaseResults = (snapshot) => {
        const results = snapshot.val();
        this.handler = Util.onRegattaResultsChange(this.regatta, (regatta, data) => {
            this.setState({
                regatta: regatta,
                results: results,
                events: data
            });
        });
    }

    render() {
        if (this.state.results) {
            let items = [];
            let used = {};
            if (this.needsScrollToEnd) {
                this.needsScrollToEnd = false;

                const elem = ReactDOM.findDOMNode(this.refs.EndOfList);
                setTimeout(function () {

                    if (elem) {
                        elem.scrollIntoView(false);
                    }
                }, 100);
            }

            // sort raw events by time
            let events = Object.values(this.state.events).sort(function (a, b) {
                if (a.Time < b.Time) return -1;
                else if (a.Time === b.Time) return 0;
                return 1;
            });

            for (let i = 0; i < this.state.results.length; i++) {
                // entries per event
                let entries = this.state.results[i].entries;
                for (let j = 0; j < entries.length; j++) {
                    let entry = entries[j];
                    //  items.push(entry);

                    const rawTime = entry[Names.N_RAW_TIME];
                    for (let index = 0; index < events.length; index++) {
                        let item = events[index];
                        if (used[item.uuid]) continue;

                        // if gate is 'R' or '*', bow does not matter
                        if (entry[Names.N_FLIGHT] === item[Names.N_FLIGHT] &&
                            entry[Names.N_EVENTNUM] === item[Names.N_EVENTNUM] &&
                            ('?' === item[Names.N_BOW] || 'R' === item[Names.N_GATE] ||
                                '*' === item[Names.N_BOW] || entry[Names.N_BOW] === item[Names.N_BOW])) {
                            let lap = Object.assign({}, item);
                            if ("F" === lap[Names.N_GATE]) {
                                lap[Names.N_RAW_TIME] = rawTime;
                            }
                            items.push(lap);
                            used[lap.uuid] = true;
                        }
                    }
                }
            }

            // find any events not inserted
            for (let index = 0; index < events.length; index++) {
                let event = events[index];
                if (used[event.uuid]) continue;
                items.push(event);
                used[event.uuid] = true;
            }

            const onChange = this.onChange;
            return (
                <div style={{ paddingLeft: 15, paddingRight: 15 }}>
                    <Table style={{ tableLayout: 'auto' }} fixedHeader={false} selectable={false}>
                        <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                            <TableRow>
                                <TableHeaderColumn className="RegattaListHeaderRow">Deleted</TableHeaderColumn>
                                <TableHeaderColumn className="RegattaListHeaderRow">Flight</TableHeaderColumn>
                                <TableHeaderColumn className="RegattaListHeaderRow">Event Num</TableHeaderColumn>

                                <TableHeaderColumn className="RegattaListHeaderRow">Gate</TableHeaderColumn>
                                <TableHeaderColumn className="RegattaListHeaderRow">Bow</TableHeaderColumn>

                                <TableHeaderColumn className="RegattaListHeaderRow">Time</TableHeaderColumn>
                                <TableHeaderColumn className="RegattaListHeaderRow">Raw Time</TableHeaderColumn>

                                <TableHeaderColumn className="RegattaListHeaderRow">Penalty Code</TableHeaderColumn>
                                <TableHeaderColumn className="RegattaListHeaderRow">Penalty Time</TableHeaderColumn>
                                <TableHeaderColumn className="RegattaListHeaderRow">Crew</TableHeaderColumn>
                            </TableRow>
                        </TableHeader>
                        <TableBody stripedRows={false} displayRowCheckbox={false}>
                            {items.map(function (row, i) {
                                const uuid = row[Names.N_UUID] ? row[Names.N_UUID] : i;
                                return (<ResultsRow key={uuid} row={row} rowIndex={i} onChange={onChange} />);
                            })
                            }
                        </TableBody>
                    </Table>
                    <FloatingActionButton style={style.add} mini={true} onTouchTap={this.onAddResult}>
                        <ContentAdd />
                    </FloatingActionButton>
                    <div ref='EndOfList' />
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
            regatta = regatta.replace('.', '');
            this.regatta = regatta;
            this.resultsRef = fire.database().ref('results/' + regatta + '/results');
            this.resultsRef.on('value', this._rxFirebaseResults, this);
        }
    }

    componentWillUnMount() {
        if (this.handler) {
            Util.offRegattaResultsChange(this.handler);
            this.handler = null;
        }
        if (this.resultsRef) {
            this.resultsRef.off();
            this.resultsRef = null;
        }
    }
}

export default ResultsEdit;