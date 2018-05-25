/**
 * Created by glenne on 6/10/2017.
 */
import React from 'react';
import Measure from 'react-measure';
const styles = {
  abs: {
    position: 'fixed',
    display: 'inline-block', // only as big as needed
    top: '0px',
    left: '-1000px' // offscreen
  }
};

// Measure text specified by 'text' property and return a map
// of results via an onMeasure callback.  The style of the text
// can be specified via the textStyle property.
class MeasureText extends React.Component {
  constructor(props) {
    super(props);
    this.dims = {};
    this.text = Array.isArray(this.props.text)
      ? this.props.text
      : [this.props.text];
  }

  recordBounds(txt, bounds) {
    this.dims[txt] = bounds;
    if (Object.keys(this.dims).length === this.text.length) {
      if (this.props.onMeasure) this.props.onMeasure(this.dims);
    }
  }
  render() {
    return (
      <div style={styles.abs}>
        {/*Emit a Measure component for each text item  Place the result into this.dims. */}
        {this.text.map(txt =>
          <Measure key={txt}
            bounds
            onResize={contentRect => {
              contentRect.bounds.width = Math.trunc(contentRect.bounds.width+0.999);
              this.recordBounds(txt, contentRect.bounds);
            }}
          >
            {({ measureRef }) =>
              <div
                ref={measureRef}
                style={Object.assign({}, styles.abs, this.props.textStyle)}
                className={this.props.textClass}
              >
                {txt}
              </div>}
          </Measure>
        )}
      </div>
    );
  }
}

export default MeasureText;
