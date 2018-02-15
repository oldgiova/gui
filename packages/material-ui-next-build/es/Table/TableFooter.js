function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

import React from 'react';
import PropTypes from 'prop-types';

class TableFooter extends React.Component {
  getChildContext() {
    // eslint-disable-line class-methods-use-this
    return {
      table: {
        footer: true
      }
    };
  }

  render() {
    const _props = this.props,
          { component: Component } = _props,
          other = _objectWithoutProperties(_props, ['component']);

    return React.createElement(Component, other);
  }
}

TableFooter.propTypes = {
  /**
   * The content of the component, normally `TableRow`.
   */
  children: PropTypes.node,
  /**
   * The component used for the root node.
   * Either a string to use a DOM element or a component.
   */
  component: PropTypes.oneOfType([PropTypes.string, PropTypes.func])
};

TableFooter.defaultProps = {
  component: 'tfoot'
};

TableFooter.childContextTypes = {
  table: PropTypes.object
};

export default TableFooter;