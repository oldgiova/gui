import React from 'react';
import { connect } from 'react-redux';
import Time from 'react-time';
import ReactTooltip from 'react-tooltip';

import { Button, Icon, List, Typography } from '@material-ui/core';
import { Block as BlockIcon, Check as CheckIcon, CheckCircle as CheckCircleIcon, Help as HelpIcon, Warning as WarningIcon } from '@material-ui/icons';

import pendingIcon from '../../../assets/img/pending_status.png';
import { decommissionDevice } from '../../actions/deviceActions';
import { getReleases } from '../../actions/releaseActions';
import { setSnackbar } from '../../actions/appActions';
import { DEVICE_STATES } from '../../constants/deviceConstants';
import { getDocsVersion } from '../../selectors';
import { AuthButton } from '../helptips/helptooltips';
import ExpandableAttribute from '../common/expandable-attribute';
import AuthsetsDialog from './authsets';
import DeviceInventory from './device-details/deviceinventory';
import DeviceInventoryLoader from './device-details/deviceinventoryloader';

const iconStyle = { margin: 12 };

const states = {
  default: {
    text: 'Please check the device authentication state',
    statusIcon: <Icon style={iconStyle} component="img" src={pendingIcon} />
  },
  pending: {
    text: 'Accept, reject or dismiss the device?',
    statusIcon: <Icon style={iconStyle} component="img" src={pendingIcon} />
  },
  accepted: {
    text: 'Reject, dismiss or decommission this device?',
    statusIcon: <CheckCircleIcon className="green" style={iconStyle} />
  },
  rejected: {
    text: 'Accept, dismiss or decommission this device',
    statusIcon: <BlockIcon className="red" style={iconStyle} />
  },
  preauthorized: {
    text: 'Remove this device from preauthorization?',
    statusIcon: <CheckIcon style={iconStyle} />
  }
};

export class ExpandedDevice extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = { authsets: false };
  }

  componentDidMount() {
    if (this.props.device.status === DEVICE_STATES.accepted) {
      this.props.getReleases();
    }
  }

  toggleAuthsets(authsets = !this.state.authsets, shouldUpdate = false) {
    this.setState({ authsets });
    this.props.refreshDevices(shouldUpdate);
  }

  _decommissionDevice(device_id) {
    var self = this;
    return self.props
      .decommissionDevice(device_id)
      .then(() => {
        // close dialog!
        // close expanded device
        // trigger reset of list!
        self.toggleAuthsets(false);
      })
      .finally(() => self.props.refreshDevices(true));
  }

  render() {
    const self = this;
    const { className, device, docsVersion, highlightHelp, id_attribute, id_value, limitMaxed, setSnackbar, showHelptips, unauthorized } = self.props;
    const { auth_sets, attributes, created_ts, id, identity_data, status = DEVICE_STATES.accepted } = device;

    let deviceIdentity = [<ExpandableAttribute key="id_checksum" primary="Device ID" secondary={id || '-'} />];
    if (identity_data) {
      deviceIdentity = Object.entries(identity_data).reduce((accu, item) => {
        accu.push(<ExpandableAttribute key={item[0]} primary={item[0]} secondary={item[1]} />);
        return accu;
      }, deviceIdentity);
    }

    if (created_ts) {
      var createdTime = <Time value={created_ts} format="YYYY-MM-DD HH:mm" />;
      deviceIdentity.push(
        <ExpandableAttribute key="connectionTime" primary={status === DEVICE_STATES.preauth ? 'Date added' : 'First request'} secondary={createdTime} />
      );
    }

    const statusIcon = states[status] ? states[status].statusIcon : states.default.statusIcon;

    var hasPending = '';
    if (status === DEVICE_STATES.accepted && auth_sets.length > 1) {
      hasPending = auth_sets.reduce((accu, set) => {
        return set.status === DEVICE_STATES.pending ? 'This device has a pending authentication set' : accu;
      }, '');
    }

    const authLabelText = hasPending ? hasPending : states[status].text || states.default.text;

    const buttonStyle = { textTransform: 'none', textAlign: 'left' };

    const waiting = !(attributes && Object.values(attributes).some(i => i));
    var deviceInfo = (
      <div key="deviceinfo">
        <div className="device-identity bordered">
          <div className="margin-bottom-small">
            <h4 className="margin-bottom-none">Device identity</h4>
            <List className="list-horizontal-flex">{deviceIdentity}</List>
          </div>

          <div className="margin-bottom-small flexbox" style={{ flexDirection: 'row' }}>
            <span style={{ display: 'flex', minWidth: 180, justifyContent: 'space-evenly', alignItems: 'center', marginRight: '2vw' }}>
              {statusIcon}
              <span className="inline-block">
                <Typography variant="subtitle2" style={Object.assign({}, buttonStyle, { textTransform: 'capitalize' })}>
                  Device status
                </Typography>
                <Typography variant="body1" style={Object.assign({}, buttonStyle, { textTransform: 'capitalize' })}>
                  {status}
                </Typography>
              </span>
            </span>

            <Button
              onClick={() => {
                self.toggleAuthsets(true);
                setSnackbar('');
              }}
            >
              {hasPending ? <WarningIcon className="auth" style={iconStyle} /> : null}
              <span className="inline-block">
                <Typography variant="subtitle2" style={buttonStyle}>
                  {authLabelText}
                </Typography>
                <Typography variant="body1" className="muted" style={buttonStyle}>
                  Click to adjust authorization status for this device
                </Typography>
              </span>
            </Button>
          </div>
        </div>
        {status === DEVICE_STATES.accepted && waiting && <DeviceInventoryLoader docsVersion={docsVersion} unauthorized={unauthorized} />}
        {status === DEVICE_STATES.accepted && !waiting && (
          <DeviceInventory attributes={attributes} id={id} setSnackbar={setSnackbar} unauthorized={unauthorized} />
        )}
      </div>
    );

    return (
      <div className={className}>
        {deviceInfo}
        {showHelptips && status === DEVICE_STATES.pending ? (
          <div>
            <div
              id="onboard-4"
              className={highlightHelp ? 'tooltip help highlight' : 'tooltip help'}
              data-tip
              data-for="auth-button-tip"
              data-event="click focus"
              style={{ left: '580px', top: '178px' }}
            >
              <HelpIcon />
            </div>
            <ReactTooltip id="auth-button-tip" globalEventOff="click" place="bottom" type="light" effect="solid" className="react-tooltip">
              <AuthButton devices={[device]} />
            </ReactTooltip>
          </div>
        ) : null}

        <AuthsetsDialog
          dialogToggle={shouldUpdate => this.toggleAuthsets(false, shouldUpdate)}
          decommission={id => this._decommissionDevice(id)}
          device={device}
          id_attribute={id_attribute}
          id_value={id_value}
          limitMaxed={limitMaxed}
          open={this.state.authsets}
        />
      </div>
    );
  }
}

const actionCreators = { decommissionDevice, getReleases, setSnackbar };

const mapStateToProps = state => {
  return {
    docsVersion: getDocsVersion(state),
    onboardingComplete: state.onboarding.complete,
    showHelptips: state.users.showHelptips
  };
};

export default connect(mapStateToProps, actionCreators)(ExpandedDevice);
