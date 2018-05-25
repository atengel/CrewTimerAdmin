// import 'react-select/dist/react-select.css';
// import 'react-datepicker/dist/react-datepicker.css';
// import 'react-datepicker/dist/react-datepicker-cssmodules.css';
import './RegattaConfigurationForm.css';
import { Checkbox, RaisedButton, DatePicker, SelectField, RefreshIndicator, TextField, MenuItem } from 'material-ui';
import { Table, TableBody, TableRow, TableRowColumn } from 'material-ui/Table';
import { Prompt } from 'react-router-dom';
import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar';
import Paper from 'material-ui/Paper';

const React = require("react");

class RegattaConfigurationForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = Object.assign({ isModified: false }, this.props);

    this.onChange = (event) => {
      this.setState({ isModified: true, [event.target.name]: event.target.value });
    }
    this.handleDateChange = (event, date) => {
      var mm = date.getMonth() + 1; // getMonth() is zero-based
      var dd = date.getDate();
    
      const ymd = [date.getFullYear(),
              (mm>9 ? '' : '0') + mm,
              (dd>9 ? '' : '0') + dd
             ].join('-');
      this.setState({ isModified: true, Date: ymd });
    }
    this.handleRaceTypeChange = (event) => {
      this.setState({ isModified: true, RaceType: event.target.textContent });
    }
    this.handleHandicapTypeChange = (event, index, value) => {
      this.setState({ isModified: true, HandicapType: value });
    }
    this.handlePublicChange = (event, value) => {
      this.setState({ isModified: true, Public: value });

    }
    this.handleFinishedChange = (event, value) => {
      this.setState({ isModified: true, Finished: value });

    }
    this.onBlur = (event) => {

    }
    this.onSubmit = (event) => {
      let err = false;
      if ('' === this.state.Title) {
        this.setState({ titleMessage: 'Title must be specified' });
        err = true;
      }
      if ('' === this.state.MobileKey) {
        this.setState({ mobileKeyMessage: 'Mobile Pin must be specified' });
        err = true;
      }
      if (err) return;
      this.setState({ isModified: false });
      setTimeout(function () { this.props.onSubmit(this.state) }.bind(this), 100);
    }

    this.onCancel = (event) => {
      this.setState({ isModified: false });
      setTimeout(function () {   this.props.onCancel(); }.bind(this), 100);
    }

    this.onTestUrl = (event) => {
      this.props.onTestUrl(this.state);
    }
  }

  render() {
    const ymd = this.state.Date.split('-').map((val) => { return parseInt(val,10)});
    var date = new Date(ymd[0],ymd[1]-1,ymd[2]);
    return (
      <div className="">
        <Prompt when={this.state.isModified}
          message="You have unsaved changes in this page. Do you want to leave without saving?" />

        <Paper zDepth={1}><div style={{ "marginTop": "20px" }}>
          <Toolbar >
            <ToolbarGroup firstChild={true}>
              <ToolbarTitle text="Regatta Configuration" style={{ marginLeft: 15 }} />
            </ToolbarGroup>
            <ToolbarGroup firstChild={false}>
              <RaisedButton label="Save" 
              primary={true}
              disabled={!this.state.isModified}
                           onTouchTap={this.onSubmit} style={{ "marginRight": "20px" }} />
              <RaisedButton label="Cancel" onTouchTap={this.onCancel} />
            </ToolbarGroup>
          </Toolbar>
        </div><Table>
            <TableBody stripedRows={false} displayRowCheckbox={false}>
              <TableRow selectable={false} displayBorder={false}>
                <TableRowColumn>
                  <TextField name="Title" defaultValue={this.state.Title} floatingLabelText="Title" onChange={this.onChange} errorText={this.state.titleMessage} />
                </TableRowColumn>
                <TableRowColumn>
                  <DatePicker name="Date" onChange={this.handleDateChange} defaultDate={date} floatingLabelText="Date" />
                </TableRowColumn>
              </TableRow>
              <TableRow selectable={false} displayBorder={false}>
                <TableRowColumn>
                  <SelectField floatingLabelText="Race Type" value={this.state.RaceType} onChange={this.handleRaceTypeChange}>
                    <MenuItem value="Head" primaryText="Head" />
                    <MenuItem value="Sprint" primaryText="Sprint" />
                  </SelectField>
                </TableRowColumn>
              </TableRow>
              <TableRow selectable={false} displayBorder={false}>
                <TableRowColumn>
                  <Checkbox label="Public Visible" name="Public" onCheck={this.handlePublicChange} defaultChecked={this.state.Public === true || this.state.Public === 'true'} />
                </TableRowColumn>
                <TableRowColumn>
                  <Checkbox label="Finished" name="Finished" onCheck={this.handleFinishedChange} defaultChecked={this.state.Finished === true || this.state.Finished === 'true'} />
                </TableRowColumn>
              </TableRow>
              <TableRow selectable={false} displayBorder={false}>
                <TableRowColumn>
                  <SelectField floatingLabelText="Handicap Type" value={this.state.HandicapType} onChange={this.handleHandicapTypeChange}>
                    <MenuItem value="None" primaryText="None" />
                    <MenuItem value="Manual" primaryText="Manual" />
                    <MenuItem value="US" primaryText="US Rowing" />
                  </SelectField>
                </TableRowColumn>
                <TableRowColumn>
                  <TextField name="HandicapMultiplier" defaultValue={this.state.HandicapMultiplier} floatingLabelText="Handicap Multiplier" onChange={this.onChange} />
                </TableRowColumn>
              </TableRow>
              <TableRow selectable={false} displayBorder={false}>
                <TableRowColumn>
                  <TextField name="MobileKey" defaultValue={this.state.MobileKey} floatingLabelText="Mobile PIN" onChange={this.onChange} errorText={this.state.mobileKeyMessage} />
                </TableRowColumn>
              </TableRow>
              <TableRow selectable={false} displayBorder={false}>
                <TableRowColumn colSpan={2}>
                  <TextField name="DocUrl" fullWidth={true} defaultValue={this.state.DocUrl} floatingLabelText="Google Doc URL" onChange={this.onChange} />
                </TableRowColumn>
              </TableRow>
              <TableRow selectable={false} displayBorder={false}>
                <TableRowColumn>
                  {this.props.testingUrl ? <RefreshIndicator
                    size={40}
                    left={10}
                    top={0}
                    status='loading'
                    className="testing"
                  /> :
                    <RaisedButton label={"Test URL"} className="" onTouchTap={this.onTestUrl}></RaisedButton>
                  }
                </TableRowColumn>
                <TableRowColumn>
                  <div className={'OK' === this.props.testingStatus ? "testPass" : "testFail"}>{this.props.testingStatus}</div>
                </TableRowColumn>
              </TableRow>
              <TableRow selectable={false} displayBorder={false}>
                <TableRowColumn colSpan={2}>
                  <TextField name="CustomCodes" multiLine={true} fullWidth={true} defaultValue={this.state.CustomCodes} floatingLabelText="Custom Penalty Codes.  e.g. ABC:10,Buoy:30" onChange={this.onChange} />
                </TableRowColumn>
              </TableRow>
              <TableRow selectable={false} displayBorder={false}>
                <TableRowColumn colSpan={2}>
                  <TextField name="InfoText" multiLine={true} fullWidth={true} defaultValue={this.state.InfoText} floatingLabelText="Regatta Information shown on results page" onChange={this.onChange} />
                </TableRowColumn>
              </TableRow>
              <TableRow selectable={false} displayBorder={false}>
                <TableRowColumn colSpan={2}>
                  <TextField name="Waypoints" multiLine={true} fullWidth={true} defaultValue={this.state.Waypoints} floatingLabelText="Timing Waypoints.  e.g. Bridge, Pier" onChange={this.onChange} />
                </TableRowColumn>
              </TableRow>
              <TableRow selectable={false} displayBorder={false}>
                <TableRowColumn colSpan={2}>
                  <TextField name="ResultWaypoints" multiLine={true} fullWidth={true} defaultValue={this.state.ResultWaypoints} floatingLabelText="Result Waypoints to show on website.  Leave blank to show all Timing Waypoints." onChange={this.onChange} />
                </TableRowColumn>
              </TableRow>
            </TableBody>
          </Table></Paper>
      </div>
    );
  }
}

RegattaConfigurationForm.defaultProps = {
  values: { title: "", description: "", commitmentTime: "" },
  onChange: function (event) { console.log(event); },
  name: "regattaConfigurationForm"
};



export default RegattaConfigurationForm;
