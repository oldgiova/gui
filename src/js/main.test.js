import React from 'react';
import Linkify from 'react-linkify';
import * as router from 'react-router-dom';

import { prettyDOM } from '@testing-library/dom';
import { render, screen, waitFor } from '@testing-library/react';
import 'jsdom-worker';

import { mockDate, undefineds } from '../../tests/mockData';
import GeneralApi from './api/general-api';
import { AppProviders } from './main';

jest.mock('react-linkify');

describe('Main Component', () => {
  it('renders correctly', async () => {
    Linkify.default = jest.fn();
    Linkify.default.mockReturnValue(null);
    const { MemoryRouter } = router;
    window.localStorage.getItem.mockReturnValueOnce('false');
    const MockBrowserRouter = ({ children }) => <MemoryRouter initialEntries={['/ui']}>{children}</MemoryRouter>;
    // eslint-disable-next-line
    router.BrowserRouter = MockBrowserRouter;
    const ui = <AppProviders />;
    const post = jest.spyOn(GeneralApi, 'post');
    jest.setSystemTime(mockDate);
    const { baseElement, rerender } = render(ui);
    await waitFor(() => screen.queryByText('Software distribution'), { timeout: 2000 });
    await waitFor(() => rerender(ui));
    const view = prettyDOM(baseElement.firstChild, 100000, { highlight: false })
      .replace(/id="mui-[0-9]*"/g, '')
      .replace(/aria-labelledby="(mui-[0-9]* *)*"/g, '')
      .replace(/\\/g, '');
    expect(view).toMatchSnapshot();
    expect(view).toEqual(expect.not.stringMatching(undefineds));
    let settingsCall;
    const keys = ['approach', 'artifactIncluded', 'complete', 'deviceType', 'progress'];
    await waitFor(
      () => {
        settingsCall = post.mock.calls.filter(
          ([target, body]) => target === '/api/management/v1/useradm/settings/me' && keys.every(key => Object.keys(body.onboarding).includes(key))
        );
        return expect(settingsCall.length).toBeTruthy();
      },
      { timeout: 5000 }
    );
    expect(settingsCall).toBeTruthy();
  }, 10000);
});
