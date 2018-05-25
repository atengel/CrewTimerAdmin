import React, { Component } from 'react';
import Util from './Util';
import * as Names from './Names';
import { TableRow, TableRowColumn } from 'material-ui/Table';
import { Checkbox } from 'material-ui';
import CellEditor from './forms/CellEditor';
import TimeUtil from './util/TimeUtil';

export default class ResultsRow extends Component {
    constructor(props) {
        super(props);

        this.state = {
            row: {},
            rowIndex: 0
        };

        this.handleStateChange = (event, value) => {
            this.props.row[Names.N_STATE] = value ? 'Deleted' : 'OK';
            if (this.props.onChange) this.props.onChange(this.props.row);
        }
    }

    updateTime = (value) => {
        this.props.row[Names.N_TIME] = value;
        if (this.props.onChange) this.props.onChange(this.props.row);
    }

    updateBow = (value) => {
        this.props.row[Names.N_BOW] = value;
        if (this.props.onChange) this.props.onChange(this.props.row);
    }

    updateGate = (value) => {
        this.props.row[Names.N_GATE] = value;
        if (this.props.onChange) this.props.onChange(this.props.row);
    }

    updateEventNum = (value) => {
        this.props.row[Names.N_EVENTNUM] = value;
        if (this.props.onChange) this.props.onChange(this.props.row);
    }

    updateFlightNum = (value) => {
        this.props.row[Names.N_FLIGHT] = value;
        if (this.props.onChange) this.props.onChange(this.props.row);
    }

    updatePenCode = (value) => {
        this.props.row[Names.N_PENALTY_CODES] = value;
        if (this.props.onChange) this.props.onChange(this.props.row);
    }

    updatePenTime = (value) => {
        this.props.row[Names.N_PENALTY_TIME] = value;
        if (this.props.onChange) this.props.onChange(this.props.row);
    }

    updateRawTime = (value) => {
        // this.props.row[Names.N_FLIGHT] = value;
        // if (this.props.onChange) this.props.onChange(this.props.row);
        if (this.props.row[Names.N_GATE] === 'F') {
            let millis = TimeUtil.timeToMilli(this.props.row[Names.N_TIME]);
            let priorRaw = TimeUtil.timeToMilli(this.props.row[Names.N_RAW_TIME]);
            let newRaw = TimeUtil.timeToMilli(value);
            millis = millis + newRaw - priorRaw;
            this.props.row[Names.N_TIME] = TimeUtil.milliToString(millis);
            if (this.props.onChange) this.props.onChange(this.props.row);
        }
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
        const row = this.props.row;
        const bgStyle = { background: row.uuid ? '#ffffff' : '#f0f0f0' };
        const uuid = row[Names.N_UUID] ? row[Names.N_UUID] : this.props.rowIndex;
        const deleted = "Deleted" === row[Names.N_STATE];
        const gate = row[Names.N_GATE];
        const editTime = ('S' === gate || 'F' === gate);
        const editBow = 'R' !== gate;
        const editRaw = row[Names.N_RAW_TIME] && row[Names.N_RAW_TIME].length > 0;
        const editPen = 'Pen' === gate;
        return (
            <TableRow key={uuid} style={bgStyle} selectable={false}>
                <TableRowColumn className="RegattaListRow">
                    <Checkbox name="Deleted" onCheck={this.handleStateChange} defaultChecked={deleted} />
                </TableRowColumn>
                <TableRowColumn className="RegattaListRow">
                    <CellEditor editable={!deleted} defaultValue={row[Names.N_FLIGHT]}
                        regex='.+'
                        prompt="Enter new Flight Number"
                        onChange={this.updateFlightNum} />
                </TableRowColumn>
                <TableRowColumn className="RegattaListRow">
                    <CellEditor editable={!deleted} defaultValue={row[Names.N_EVENTNUM]}
                        regex='.+'
                        prompt="Enter new Event Number"
                        onChange={this.updateEventNum} />
                </TableRowColumn>
                <TableRowColumn className="RegattaListRow">
                    <CellEditor editable={!deleted} defaultValue={row[Names.N_GATE]}
                        regex='.+'
                        prompt="Enter Gate Code: S, F, Pen, or R"
                        onChange={this.updateGate} />
                </TableRowColumn>
                <TableRowColumn className="RegattaListRow">
                    <CellEditor editable={!deleted&&editBow} 
                        defaultValue={row[Names.N_BOW]}
                        regex='.+'
                        prompt="Enter new Bow number"
                        onChange={this.updateBow} />
                </TableRowColumn>

                <TableRowColumn className="RegattaListRow">
                    <CellEditor editable={!deleted && editTime} defaultValue={row[Names.N_TIME]}
                        prompt='Enter new HH:MM:SS.SSS value'
                        regex='^[0-9][0-9]:[0-9][0-9]:[0-9][0-9][.][0-9][0-9][0-9]$'
                        onChange={this.updateTime} />
                </TableRowColumn>
                <TableRowColumn className="RegattaListRow">
                <CellEditor editable={!deleted && editRaw} 
                defaultValue={row[Names.N_RAW_TIME]}
                        prompt='Enter new MM:SS.SSS value'
                        regex='^([0-9][0-9]:)?[0-9][0-9]:[0-9][0-9][.]?[0-9]?[0-9]?[0-9]?$'
                        onChange={this.updateRawTime} />
                    </TableRowColumn>
                <TableRowColumn className="RegattaListRow">
                <CellEditor editable={!deleted&&editPen} 
                        defaultValue={row[Names.N_PENALTY_CODES]}
                        regex='.*'
                        prompt="Enter Penalty Code"
                        onChange={this.updatePenCode} />
                    </TableRowColumn>
                <TableRowColumn className="RegattaListRow">
                <CellEditor editable={!deleted&&editPen} 
                        defaultValue={row[Names.N_PENALTY_TIME]}
                        regex='^[0-9]*[.]?[0-9]+$'
                        prompt="Enter Penalty Time"
                        onChange={this.updatePenTime} />
                    </TableRowColumn>
                <TableRowColumn className="RegattaListRow">{row[Names.N_CREW]}</TableRowColumn>
            </TableRow>);
    }
}