import React, { Component } from 'react';
import Paper from 'material-ui/Paper';

const style = {
  margin: 20,
  padding: 20,
  textAlign: 'center',
  display: 'inline-block',
};

class StoreComplete extends Component {
    render() {
        return (<Paper style={style} ><p>Thank you for your payment.</p>
        <p>Your transaction has been completed, and a receipt for your purchase has been emailed to you.</p>
        <p>You may log into your account at PayPal to view details of this transaction.</p>
        </Paper>);
    }
  }

export default StoreComplete;