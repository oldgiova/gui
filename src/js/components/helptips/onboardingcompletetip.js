// Copyright 2019 Northern.tech AS
//
//    Licensed under the Apache License, Version 2.0 (the "License");
//    you may not use this file except in compliance with the License.
//    You may obtain a copy of the License at
//
//        http://www.apache.org/licenses/LICENSE-2.0
//
//    Unless required by applicable law or agreed to in writing, software
//    distributed under the License is distributed on an "AS IS" BASIS,
//    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//    See the License for the specific language governing permissions and
//    limitations under the License.
import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import { Button } from '@mui/material';
import { withStyles } from 'tss-react/mui';

import { getDeviceById, getDevicesByStatus } from '../../actions/deviceActions';
import { setOnboardingComplete } from '../../actions/onboardingActions';
import * as DeviceConstants from '../../constants/deviceConstants';
import { onboardingSteps } from '../../constants/onboardingConstants';
import { getDemoDeviceAddress } from '../../selectors';
import DocsLink from '../common/docslink';
import Loader from '../common/loader';
import { MenderTooltipClickable } from '../common/mendertooltip';

export const CompletionButton = withStyles(Button, ({ palette }) => ({
  root: {
    backgroundColor: palette.background.default,
    '&:hover': {
      backgroundColor: palette.background.default
    }
  }
}));

export const OnboardingCompleteTip = ({ anchor, targetUrl }) => {
  const timer = useRef();
  const dispatch = useDispatch();
  const url = useSelector(getDemoDeviceAddress) || targetUrl;

  useEffect(() => {
    dispatch(getDevicesByStatus(DeviceConstants.DEVICE_STATES.accepted))
      .then(tasks => {
        return Promise.all(tasks[tasks.length - 1].deviceAccu.ids.map(id => dispatch(getDeviceById(id))));
      })
      .finally(() => {
        timer.current = setTimeout(() => dispatch(setOnboardingComplete(true)), 120000);
      });
    return () => {
      dispatch(setOnboardingComplete(true));
      clearTimeout(timer.current);
    };
  }, [dispatch]);

  return (
    <MenderTooltipClickable
      className="tooltip onboard-icon onboard-tip"
      id={onboardingSteps.DEPLOYMENTS_PAST_COMPLETED}
      onboarding
      startOpen
      style={anchor}
      PopperProps={{ style: { marginLeft: -30, marginTop: -20 } }}
      title={
        <div className="content">
          <p>Fantastic! You completed your first deployment!</p>
          <p>Your deployment is finished and your device is now running the updated software!</p>
          <div className="margin-bottom-small margin-top-small">
            Your device is now running the updated version of the software. At
            <div className="flexbox centered" style={{ margin: '5px 0' }}>
              {!url ? (
                <Loader show={true} />
              ) : (
                <CompletionButton
                  className="button"
                  variant="text"
                  href={`${url}/index.html?source=${encodeURIComponent(window.location)}`}
                  target="_blank"
                >{`Go to ${url}`}</CompletionButton>
              )}
            </div>
            you should see the demo web application actually being run on the device.
          </div>
          <p>NOTE: if you have local network restrictions, you may need to check them if you have difficulty loading the page.</p>
          <p>You&apos;ve now got a good foundation in how to use Mender. Look for more help hints in the UI as you go along.</p>
          What next?
          <div>
            Proceed to one of the following tutorials (listed in recommended order):
            <ol>
              <li key="deploy-a-system-update">
                <DocsLink path="get-started/deploy-an-operating-system-update" title="Deploy an operating system update" />
              </li>
              <li key="deploy-a-container-update">
                <DocsLink path="get-started/deploy-a-container-update" title="Deploy a container update" />
              </li>
            </ol>
          </div>
          <div className="flexbox">
            <div style={{ flexGrow: 1 }} />
            <Button variant="contained" color="secondary" onClick={() => dispatch(setOnboardingComplete(true))}>
              Close
            </Button>
          </div>
        </div>
      }
    >
      <CheckCircleIcon />
    </MenderTooltipClickable>
  );
};

export default OnboardingCompleteTip;
