import React, { Component } from 'react';
import Paper from 'material-ui/Paper';

const styles = {
  wrap: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around'
  },
  paper: {
    padding: 20,
    width: 400,
    margin: 20,
  }
};

export default class Donate extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };

  }

  render() {
    return (
      <div style={styles.wrap}>
      <Paper style={styles.paper}>
        <div><p>Thank you for your support of CrewTimer.  While the service is free, there are some infrastructure costs
  as well as a great deal of personal time devoted to the mobile app and the web interfaces to make it work
  smoothly for your regattas.</p> 
  <p> If you have found CrewTimer useful, please consider donating dinner for two so my wife can get some payback for time I've spent developing CrewTimer!</p>
 <p>Of course, just sending me an
  email, a regatta T-shirt, or a positive review in the mobile app store works for me too.</p><p>I hope you've found CrewTimer useful.</p>
          <p>Glenn</p>
          <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
            <input type="hidden" name="cmd" value="_s-xclick" />
            <input type="hidden" name="hosted_button_id" value="ARUVAF6ANK9L6" />
            <input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_buynow_LG.gif" border="0" name="submit" alt="PayPal - The safer, easier way to pay online!" />
            <img alt="" border="0" src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" width="1" height="1" />
          </form>
        </div>
      </Paper>
      </div>
    );
  }
}
