import React from 'react';
var createReactClass = require('create-react-class');
import TextField from 'material-ui/TextField';

var TextInput = createReactClass({
  getInitialState: function () {
    return {
      value: this.props.value || '',
      errorText: null,
      isValid: true
    };
  },

  componentWillMount: function () {
    this.props.attachToForm(this); // Attaching the component to the form
  },
  componentWillUnmount: function () {
    this.props.detachFromForm(this); // Detaching if unmounting
  },
  componentDidMount: function() {
    if (this.props.value) {
       this.props.validate(this, this.props.value);
    }
   
  },
  setValue: function (event) {
    this.setState({
      value: event.currentTarget.value
    });
    this.props.validate(this, event.currentTarget.value);
  },
  render: function () {
    var className = this.props.required ? this.props.className + " required" : this.props.className;
    return (
      <TextField
        id={this.props.id}
        name={this.props.id}
        defaultValue={this.props.defaultValue}
        value={this.state.value}
        hintText={this.props.hint}
        floatingLabelText={this.props.label} 
        onChange={this.setValue}
        className={className}
        errorStyle={{color: "rgb(171, 16, 0)"}}
        multiLine={this.props.multiLine}
        rows={this.props.rows}
        style={{display:"block", width:"400px", maxWidth:"100%"}}
        errorText={this.state.errorText}
        required={this.props.required}
        type={this.props.type}
        onKeyPress={this.props.handleKeyPress}
        />
    )
  }
});

module.exports = TextInput;

