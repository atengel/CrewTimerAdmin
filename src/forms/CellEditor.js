import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

/**
 * Dialogs can be nested. This example opens a Date Picker from within a Dialog.
 */
export default class CellEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editable: false,
      open: false,
    };
    this.validate =  new RegExp(this.props.regex ? this.props.regex : '.*');
  
  }

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    if (this.props.onChange && this.newValue) {
      this.props.onChange(this.props.name, this.newValue);
    }

    this.setState({ open: false });
  };
  handleCancel = () => {
    this.setState({ open: false });
  };

  onTextChange = (event) => {
    const ok = this.validate.test(event.target.value);
    this.newValue = event.target.value;
    this.setState({"errorText" : ok ? null : "Invalid value" });
  }

  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary={false}
        keyboardFocused={false}
        onClick={this.handleCancel}
      />,
      <FlatButton
        label="Ok"
        disabled={this.state.errorText?true:false}
        primary={true}
        keyboardFocused={false}
        onClick={this.handleClose}
      />,
    ];

    const val = this.props.defaultValue ? this.props.defaultValue : <div>&nbsp;</div>;
    if (this.props.editable) return (
      <div>
        <div onClick={this.handleOpen}>{val}</div>
        <Dialog
          title={this.props.prompt}
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
          style={{ maxWidth: 400, zIndex: 5000 }}
        >
          <TextField hintText={this.props.prompt} style={{ width: 250 }} 
              errorText={this.state.errorText} 
              defaultValue={this.props.defaultValue} onChange={this.onTextChange} />
        </Dialog>
      </div>
    );
    return (
      <div>{this.props.defaultValue}</div>);
  }
};

