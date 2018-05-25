import React, { Component } from 'react';
import * as Names from './Names';
import Util from './Util';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from 'material-ui/Table';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import LoadingIndicator from './LoadingIndicator';

import Divider from 'material-ui/Divider';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import Snackbar from 'material-ui/Snackbar';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import ImageTimer from 'material-ui/svg-icons/image/timer';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import ActionRowing from 'material-ui/svg-icons/action/rowing';
import ContentClear from 'material-ui/svg-icons/content/clear';
import EditorModeEdit from 'material-ui/svg-icons/editor/mode-edit';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import NavigationRefresh from 'material-ui/svg-icons/navigation/refresh';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar';

const style = {
  container: {
    position: 'relative',
  },
  refresh: {
    display: 'inline-block',
    position: 'relative',
  },
  add: {
    marginLeft: 20,
  }
};

const dialogConfig = {
  Clear: {
    title: 'Clear Race Data',
    message: "This action will clear all race data and is not recoverable.  If you proceed, your regatta will be RESET back to it's initial state.",
    button: 'Clear',
    showCancel: true
  },
  Delete: {
    title: 'Warning: Delete Regatta',
    message: "This action will delete the regatta and is not recoverable.  If you proceed, your regatta will be PERMANENTLY ERASED from CrewTimer.",
    button: 'Delete',
    showCancel: true
  },
  Reload: {
    title: 'Reload Lineups',
    message: "Load your lineup spreadsheet and replace existing linups?",
    button: 'Reload',
    showCancel: true
  },
  ReloadFail: {
    title: 'Reload Lineups Failed',
    message: "Reload Failed",
    button: 'OK',
    showCancel: false
  }
};

// re withRouter: https://reacttraining.com/react-router/web/api/withRouter
//                https://stackoverflow.com/questions/31079081/programmatically-navigate-using-react-router
class RegattaList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dialog: null,
      open: false,
      regattaNames: null,
      regattaSelected: null,
      notice: '',
      loadingStatus: 'hide'
    };
    this.onMenuSelect = this.onMenuSelect.bind(this);
  }

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false, dialog: null });
  };

  onAddRegatta = () => {
    const { history } = this.props;
    history.push('/edit/new');
  }

  handleConfirm = () => {
    let regatta = this.state.regattaSelected;
    console.log("Doing confirm action ",
      this.state.dialog, " for regatta ", regatta);
    switch (this.state.dialog) {
      case 'Configure':
        break;
      case 'Reload':
        break;
      case 'Clear':
        this.setState({ showProgress: true });
        Util.clearLapData(regatta)
          .then((done) => { this.setState({ showProgress: false }) })
          .catch((reason) => { this.setState({ showProgress: false }) });
        break;
      case 'Delete':
        this.setState({ showProgress: true });
        Util.deleteRegatta(regatta)
          .then((done) => { this.setState({ showProgress: false }) })
          .catch((reason) => { 
            this.setState({ showProgress: false, notice: ''+reason }) });
        break;
      default:
        break;
    }
    this.setState({ open: false, dialog: null });
  };

  onMenuSelect(event, menuItem, index) {
    let mobileKey = menuItem.props.data[Names.N_NAME].replace('.', '');
    console.log("Action=", menuItem.key, " regatta=", mobileKey);
    const { history } = this.props;
    switch (menuItem.key) {
      case 'Configure':
        // change to regatta config page for 'mobileKey'.
        history.push('/edit/' + mobileKey);
        break;
      case 'Results':
        window.open('https://www.crewtimer.com/regatta/' + mobileKey, '_blank');
        break;
      case 'Adjust':
        // change to regatta config page for 'mobileKey'.
        history.push('/results-edit/' + mobileKey);
        break;
      case 'Reload':
        this.setState({ loadingStatus: mobileKey });
        Util.reloadCsv(mobileKey).then((result) => {
          if (result.status === "OK") {
            this.setState({ loadingStatus: null, notice: 'New lineups read from google docs' });
          } else {
            dialogConfig['ReloadFail'].message = result.status;
            this.setState({ loadingStatus: null, open: true, dialog: 'ReloadFail', regattaSelected: mobileKey });
          }
          console.log("reload complete");
        }).catch((reason) => {
          dialogConfig['ReloadFail'].message = ''+reason;
          this.setState({ loadingStatus: null, open: true, dialog: 'ReloadFail', regattaSelected: mobileKey });
          console.log("update failed: ", reason);
        });
        break;
      case 'Clear':
      case 'Delete':
        this.setState({ open: true, dialog: menuItem.key, regattaSelected: mobileKey });
        break;
      default:
        break;
    }
  }

  componentWillMount() {
    this.changeRef = Util.onRegattaSummaryChange((values) => {
      // sort by date
      const regattaNames = values
        .sort(function (a, b) {
          if (a.Date < b.Date) return -1;
          else if (a.Date === b.Date) return 0;
          return 1;
        })
        .reverse();
      // use a timeout to set the state
      setTimeout(function () {
        this.setState({ regattaNames: regattaNames });
      }.bind(this), 16);
    });
  }

  componentWillUnmount() {
    if (this.changeRef) {
      Util.offRegattaResultsChange(this.changeRef);
      this.changeRef = null;
    }
  }

  render() {
    let dialog = null;
    if (this.state.open) {
      var config = dialogConfig[this.state.dialog];
      let actions = [
        config.showCancel ? <FlatButton
          label="Cancel"
          primary={true}
          onTouchTap={this.handleClose}
        /> : null,
        <FlatButton
          label={config.button}
          primary={true}
          keyboardFocused={true}
          onTouchTap={this.handleConfirm}
        />,
      ];
      dialog = <Dialog
        title={config.title}
        actions={actions}
        modal={false}
        open={true}
        onRequestClose={this.handleClose}
      >{config.message}</Dialog>;
    }
    if (this.state.regattaNames) {
      let onMenuSelect = this.onMenuSelect;
      let loadingStatus = this.state.loadingStatus;
      return (
        <div>
          {dialog}
          <Toolbar >
            <ToolbarGroup firstChild={true}>
              <ToolbarTitle text="My Regattas" style={{ marginLeft: 15 }} />
            </ToolbarGroup>
            <ToolbarGroup firstChild={false}>
              <FloatingActionButton style={style.add} mini={true} onTouchTap={this.onAddRegatta}>
                <ContentAdd />
              </FloatingActionButton>
            </ToolbarGroup>
          </Toolbar>
          <div style={{ paddingLeft: 15, paddingRight: 15 }}>
            <Table style={{ tableLayout: 'auto' }} fixedHeader={false}>
              <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                <TableRow>
                  <TableHeaderColumn className="RegattaListHeaderRow">Title</TableHeaderColumn>
                  <TableHeaderColumn className="RegattaListHeaderRow">Date</TableHeaderColumn>
                  <TableHeaderColumn className="RegattaListHeaderRow">Mobile ID</TableHeaderColumn>
                  <TableHeaderColumn className="RegattaListHeaderRow">Access</TableHeaderColumn>
                  <TableHeaderColumn className="RegattaListHeaderRow">Race Type</TableHeaderColumn>
                  <TableHeaderColumn className="RegattaListHeaderRow">Action</TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody stripedRows={false} displayRowCheckbox={false}>
                {this.state.regattaNames.map(function (row, i) {
                  let mobileKey = row[Names.N_NAME];
                  let showLoading = loadingStatus === mobileKey;
                  const bgStyle = { background: i % 2 ? '#ffffff' : '#f0f0f0' };

                  mobileKey = mobileKey.substring(0, 4) + '.' + mobileKey.substring(4);
                  return (
                    <TableRow key={mobileKey} style={bgStyle}>
                      <TableRowColumn className="RegattaListRow">{row[Names.N_TITLE]}</TableRowColumn>
                      <TableRowColumn className="RegattaListRow">{row[Names.N_DATE]}</TableRowColumn>
                      <TableRowColumn className="RegattaListRow">{mobileKey}</TableRowColumn>
                      <TableRowColumn className="RegattaListRow">{row[Names.N_PUBLIC] ? "Public" : "Private"}</TableRowColumn>
                      <TableRowColumn className="RegattaListRow">{row[Names.N_RACE_TYPE]}</TableRowColumn>
                      <TableRowColumn className="RegattaListRow"><div>
                        {showLoading ? <RefreshIndicator
                          size={40}
                          left={10}
                          top={0}
                          status='loading'
                          style={style.refresh}
                        /> : <IconMenu
                          onItemTouchTap={onMenuSelect}
                          iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
                          anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
                          targetOrigin={{ horizontal: 'right', vertical: 'top' }}
                        >
                            <MenuItem key='Configure' data={row} primaryText="Configure" leftIcon={<EditorModeEdit />} />
                            <MenuItem key='Results' data={row} primaryText="Results" leftIcon={<ActionRowing />} />
                            <MenuItem key='Adjust' data={row} primaryText="Adjust Results" leftIcon={<ImageTimer />} />
                            <MenuItem key='Reload' data={row} primaryText="Refresh Lineups" leftIcon={<NavigationRefresh />} />
                            <Divider />
                            <MenuItem key='Clear' data={row} primaryText="Clear Race Data" leftIcon={<ContentClear />} />
                            <Divider />
                            <MenuItem key='Delete' data={row} primaryText="Delete Regatta" leftIcon={<ActionDelete />} />
                          </IconMenu>}</div></TableRowColumn>
                    </TableRow>);
                })
                }
              </TableBody>
            </Table>
          </div>
          {this.state.regattaNames.length === 0 ? <p>Click the add icon to add your first regatta.</p> : null}
          <Snackbar
            open={this.state.notice !== ''}
            message={this.state.notice}
            autoHideDuration={4000}
            onRequestClose={() => { this.setState({ notice: '' }) }}
          />
        </div>
      )
    } else {
      return <LoadingIndicator />;
    }
  }
}

export default RegattaList;