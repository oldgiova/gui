import { defaultPermissionSets, emptyRole, emptyUiPermissions, rolesById, rolesByName, uiPermissionsById } from '../src/js/constants/userConstants';
import DeviceConstants from '../src/js/constants/deviceConstants';
import { SORTING_OPTIONS } from '../src/js/constants/appConstants';
import { roles as rbacRoles } from '../tests/__mocks__/userHandlers';

export const undefineds = /undefined|\[object Object\]/;
window.mender_environment = {
  features: {
    hasMultitenancy: true
  },
  integrationVersion: 'saas-123.34',
  menderVersion: 'next',
  metaMenderVersion: 'saas-123.34',
  services: {
    deploymentsVersion: '1.2.3',
    deviceauthVersion: null,
    inventoryVersion: null
  }
};

export const TEST_SESSION_DATETIME = '2019-01-01T13:00:00.000Z';
const testDate = new Date(TEST_SESSION_DATETIME);
export const mockDate = new Date(testDate.setMilliseconds(testDate.getMilliseconds() + 900));

export const token =
  'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjZTNkMGY4Yy1hZWRlLTQwMzAtYjM5MS03ZDUwMjBlYjg3M2UiLCJzdWIiOiJhMzBhNzgwYi1iODQzLTUzNDQtODBlMy0wZmQ5NWE0ZjZmYzMiLCJleHAiOjE2MDY4MTUzNjksImlhdCI6MTYwNjIxMDU2OSwibWVuZGVyLnRlbmFudCI6IjVmODVjMTdiY2U2MmI3ZmE3ZjVmNzA0MCIsIm1lbmRlci51c2VyIjp0cnVlLCJpc3MiOiJNZW5kZXIgVXNlcnMiLCJzY3AiOiJtZW5kZXIuKiIsIm1lbmRlci5wbGFuIjoicHJvZmVzc2lvbmFsIiwibmJmIjoxNjA2MjEwNTY5fQ.qVgYdCzLTf8OdK9uUctqqaY_HWkIiwpekuGvuGQAXCEgOv4bRNDlZRN_ZRSbxQoARG3pquhScbQrjBV9tcF4irTUPlTn3yrsXNO17DpcbTVeKRkb88RDtIKiRw3orVZ_GlIb-ckTQ5dS-Nqlyyf3Fmrhca-gwt6m_xv2UrmJK6eYYTMfggdRRWb-4u7mEkBI_pHPMTQrT8kJ2BeX-vHgazH9AoH0k85LHtFZQXD7pXHlDZRnLxJXukncwMGDmF17374gavYAIyDIzcC8sEBMDnVXgpikeA1sauzirqix6mAVs6XmxdQO7aF0wfXO1_PTYUA3Nk1oQfMYNlEI3U9uLRJRZIq2L8fmrrBryhstKd4y0KlBbGAQrx8NtRkgajjd1ljMfPBUEZrb7uSerVjneiO-aIBO76CuH0zdklphIjpGJeogkBhe8pAYNggp1XsZHgpZfl7IE5faKaDkMGnutaea--Czor6bhqUNCuY4tR0cpQJbNwy6LS9o1CFy4Log';

export const userId = 'a30a780b-b843-5344-80e3-0fd95a4f6fc3';
export const defaultState = {
  app: {
    hostedAnnouncement: null,
    docsVersion: null,
    features: {
      isDemoMode: false
    },
    snackbar: {},
    versionInformation: {}
  },
  deployments: {
    byId: {
      d1: {
        id: 'd1',
        name: 'test deployment',
        artifact_name: 'r1',
        artifacts: ['123'],
        created: '2019-01-01T12:30:00.000Z',
        device_count: 1,
        devices: {
          a1: {
            attributes: {},
            id: 'a1',
            status: 'installing'
          }
        },
        stats: {
          downloading: 0,
          decommissioned: 0,
          failure: 0,
          installing: 1,
          noartifact: 0,
          pending: 0,
          rebooting: 0,
          success: 0,
          'already-installed': 0
        }
      },
      d2: {
        id: 'd2',
        name: 'test deployment 2',
        artifact_name: 'r1',
        artifacts: ['123'],
        created: '2019-01-01T12:25:00.000Z',
        device_count: 1,
        devices: {
          b1: {
            attributes: {},
            id: 'b1',
            status: 'pending'
          }
        },
        stats: {
          downloading: 0,
          decommissioned: 0,
          failure: 0,
          installing: 0,
          noartifact: 0,
          pending: 1,
          rebooting: 0,
          success: 0,
          'already-installed': 0
        }
      }
    },
    byStatus: {
      finished: { deploymentIds: ['d1'], total: 1 },
      inprogress: { deploymentIds: ['d1'], total: 1 },
      pending: { deploymentIds: ['d2'], total: 1 },
      scheduled: { deploymentIds: ['d2'], total: 1 }
    },
    deploymentDeviceLimit: 500,
    selectedDeployment: 'd1',
    selectedDeviceIds: [],
    selectionState: {
      finished: {
        ...DeviceConstants.DEVICE_LIST_DEFAULTS,
        selection: ['d1'],
        endDate: undefined,
        search: '',
        total: 1,
        type: ''
      },
      inprogress: { ...DeviceConstants.DEVICE_LIST_DEFAULTS, selection: ['d1'], total: 1 },
      pending: { ...DeviceConstants.DEVICE_LIST_DEFAULTS, selection: ['d2'], total: 1 },
      scheduled: { ...DeviceConstants.DEVICE_LIST_DEFAULTS, selection: ['d2'], total: 1 },
      general: {
        state: '/deployments/active',
        showCreationDialog: false,
        showReportDialog: false,
        reportType: null
      }
    }
  },
  devices: {
    byId: {
      a1: {
        id: 'a1',
        attributes: {
          device_type: ['raspberrypi4'],
          ipv4_wlan0: '192.168.10.141/24'
        },
        identity_data: { mac: 'dc:a6:32:12:ad:bf' },
        status: 'accepted',
        decommissioning: false,
        created_ts: '2019-01-01T06:25:00.000Z',
        updated_ts: '2019-01-01T09:25:00.000Z',
        auth_sets: [
          {
            id: 'auth1',
            identity_data: { mac: 'dc:a6:32:12:ad:bf' },
            pubkey: '-----BEGIN PUBLIC KEY-----\nMIIBojWELzgJ62hcXIhAfqfoNiaB1326XZByZwcnHr5BuSPAgMBAAE=\n-----END PUBLIC KEY-----\n',
            ts: '2019-01-01T06:25:00.000Z',
            status: 'accepted'
          }
        ]
      },
      b1: {
        id: 'b1',
        attributes: {
          ipv4_wlan0: '192.168.10.141/24',
          device_type: ['qemux86-64']
        },
        identity_data: { mac: 'dc:a6:32:12:ad:bf' },
        status: 'accepted',
        decommissioning: false,
        created_ts: '2019-01-01T06:25:00.000Z',
        updated_ts: '2019-01-01T09:25:00.000Z',
        auth_sets: [
          {
            id: 'auth1',
            identity_data: { mac: 'dc:a6:32:12:ad:bf' },
            pubkey: '-----BEGIN PUBLIC KEY-----\nMIIBojWELzgJ62hcXIhAfqfoNiaB1326XZByZwcnHr5BuSPAgMBAAE=\n-----END PUBLIC KEY-----\n',
            ts: '2019-01-01T06:25:00.000Z',
            status: 'accepted'
          }
        ]
      },
      c1: {
        id: 'c1',
        auth_sets: [],
        attributes: {
          device_type: ['qemux86-128']
        }
      }
    },
    byStatus: {
      accepted: { deviceIds: ['a1', 'b1'], total: 2 },
      active: { deviceIds: [], total: 0 },
      inactive: { deviceIds: [], total: 0 },
      pending: { deviceIds: ['c1'], total: 1 },
      preauthorized: { deviceIds: [], total: 0 },
      rejected: { deviceIds: [], total: 0 }
    },
    deviceList: {
      deviceIds: [],
      isLoading: false,
      page: 1,
      perPage: 20,
      selectedAttributes: [],
      selectedIssues: [],
      selection: [],
      sort: {
        direction: SORTING_OPTIONS.desc,
        columns: [
          // { column: null, scope: null }
        ]
      },
      state: DeviceConstants.DEVICE_STATES.accepted,
      total: 0
    },
    filteringAttributes: {
      identityAttributes: ['mac'],
      inventoryAttributes: ['artifact_name'],
      tagAttributes: []
    },
    filteringAttributesLimit: 10,
    filters: [],
    groups: {
      byId: {
        testGroup: {
          deviceIds: ['a1', 'b1'],
          filters: [],
          total: 2
        },
        testGroupDynamic: {
          id: 'filter1',
          filters: [{ scope: 'system', key: 'group', operator: '$eq', value: 'things' }]
        }
      },
      selectedGroup: undefined
    },
    limit: 500
  },
  onboarding: {
    complete: false,
    demoArtifactPort: 85,
    showCreateArtifactDialog: false,
    showConnectDeviceDialog: false,
    showTipsDialog: false
  },
  monitor: {
    alerts: {
      alertList: { ...DeviceConstants.DEVICE_LIST_DEFAULTS, total: 0 },
      byDeviceId: {
        a1: [
          {
            description: 'something',
            id: '31346239-3839-6262-2d63-3365622d3437',
            name: 'SSH Daemon is not running',
            device_id: 'a1',
            level: 'CRITICAL',
            subject: {
              name: 'sshd',
              type: 'systemd',
              status: 'not-running',
              details: { description: 'Jul 22 10:40:56 raspberrypi sshd[32031]: pam_unix(sshd:session): session closed for user root' }
            },
            timestamp: '2021-07-23T12:22:36Z'
          }
        ]
      }
    },
    issueCounts: {
      byType: {
        [DeviceConstants.DEVICE_ISSUE_OPTIONS.authRequests.key]: { filtered: 0, total: 0 },
        [DeviceConstants.DEVICE_ISSUE_OPTIONS.monitoring.key]: { filtered: 3, total: 0 },
        [DeviceConstants.DEVICE_ISSUE_OPTIONS.offline.key]: { filtered: 0, total: 0 }
      }
    },
    settings: {
      global: {
        channels: { email: { enabled: true } }
      }
    }
  },
  organization: {
    card: {
      brand: 'testCorp',
      last4: '7890',
      expiration: { month: 1, year: 2024 }
    },
    auditlog: {
      events: [
        {
          actor: {
            id: 'string',
            type: 'user',
            email: 'string@example.com'
          },
          time: '2019-01-01T12:10:22.667Z',
          action: 'create',
          object: {
            id: 'string',
            type: 'user',
            user: {
              email: 'user@acme.com'
            }
          },
          change: 'change1'
        },
        {
          actor: {
            id: 'string',
            type: 'user',
            email: 'string',
            identity_data: 'string'
          },
          time: '2019-01-01T12:16:22.667Z',
          action: 'create',
          object: {
            id: 'string',
            type: 'deployment',
            deployment: {
              name: 'production',
              artifact_name: 'Application 0.0.1'
            }
          },
          change: 'change2'
        },
        {
          actor: {
            id: 'string',
            type: 'user',
            email: 'string@example.com'
          },
          time: '2019-01-01T12:10:22.669Z',
          action: 'open_terminal',
          meta: {
            session_id: ['abd313a8-ee88-48ab-9c99-fbcd80048e6e']
          },
          object: {
            id: 'a1',
            type: 'device'
          },
          change: 'change3'
        }
      ],
      selectionState: {
        ...DeviceConstants.DEVICE_LIST_DEFAULTS,
        total: 3
      }
    },
    externalDeviceIntegrations: [],
    intentId: 'testIntent',
    organization: {
      id: 1,
      name: 'test',
      plan: 'os',
      trial: false
    }
  },
  releases: {
    artifactProgress: 0,
    byId: {
      r1: {
        Name: 'r1',
        Artifacts: [
          {
            id: 'art1',
            description: 'test description',
            device_types_compatible: ['qemux86-64'],
            modified: '2020-09-10T12:16:22.667Z',
            updates: [{ type_info: 'testtype' }],
            artifact_depends: {
              device_type: ['qemux86-64']
            },
            artifact_provides: {
              artifact_name: 'myapp',
              'data-partition.myapp.version': 'v2020.10',
              list_of_fancy: ['qemux86-64', 'x172']
            },
            clears_artifact_provides: ['data-partition.myapp.*']
          }
        ],
        device_types_compatible: ['qemux86-64'],
        modified: '2020-09-10T12:16:22.667Z',
        metaData: {}
      }
    },
    releasesList: {
      ...DeviceConstants.DEVICE_LIST_DEFAULTS,
      searchedIds: [],
      releaseIds: ['r1'],
      sort: {
        direction: SORTING_OPTIONS.desc,
        attribute: 'Name'
      },
      searchTerm: '',
      searchTotal: 0,
      total: 1
    },
    selectedArtifact: null,
    selectedRelease: null,
    showRemoveDialog: false,
    uploading: false
  },
  users: {
    byId: {
      a1: { email: 'a@b.com', id: 'a1', created_ts: '2019-01-01T10:30:00.000Z', roles: [rolesByName.admin], verified: true },
      [userId]: { email: 'a2@b.com', id: userId, created_ts: '2019-01-01T12:30:00.000Z' }
    },
    currentUser: 'a1',
    customColumns: [],
    globalSettings: { '2fa': 'enabled', id_attribute: undefined, previousFilters: [] },
    jwtToken: null,
    qrCode: null,
    rolesById: {
      ...rolesById,
      test: {
        ...emptyRole,
        title: 'test',
        description: 'test description',
        editable: true,
        uiPermissions: {
          ...emptyUiPermissions,
          groups: { testGroup: [uiPermissionsById.read.value] }
        }
      }
    },
    settingsInitialized: true,
    showHelptips: true
  }
};

export const releasesList = Array.from({ length: 5000 }, (x, i) => ({
  ...defaultState.releases.byId.r1,
  Name: `release-${i + 1}`,
  modified: i
}));

export const permissionSets = [
  {
    name: defaultPermissionSets.Basic.value,
    object: '',
    description: 'Set containing basic permissions.',
    permissions: [
      { action: 'http', object: { type: 'any', value: '^/api/management/v1/useradm/settings$' } },
      { action: 'http', object: { type: 'any', value: '^/api/management/v1/useradm/users/me$' } },
      { action: 'http', object: { type: 'any', value: '^/api/management/1.0/auth/verify$' } },
      { action: 'http', object: { type: 'PUT', value: '^/api/management/v1/useradm/2faverify$' } },
      { action: 'http', object: { type: 'POST', value: '^/api/management/v1/useradm/users/me/2fa/(enable|disable)$' } },
      { action: 'http', object: { type: 'GET', value: '^/api/management/(v[1-9])/useradm/roles' } },
      { action: 'http', object: { type: 'GET', value: '^/api/management/(v[1-9])/tenantadm/user/tenant' } }
    ]
  },
  {
    name: defaultPermissionSets.ManageReleases.value,
    action: 'Manage',
    object: 'Releases',
    description: 'Set of permissions which allows user to manage releases',
    permissions: [
      { action: 'http', object: { type: 'GET', value: '^/api/management/v1/deployments/artifacts' } },
      { action: 'http', object: { type: 'GET', value: '^/api/management/v1/deployments/artifacts/[^/]+' } },
      { action: 'http', object: { type: 'PUT', value: '^/api/management/v1/deployments/artifacts/[^/]+' } },
      { action: 'http', object: { type: 'DELETE', value: '^/api/management/v1/deployments/artifacts/[^/]+' } },
      { action: 'http', object: { type: 'GET', value: '^/api/management/v1/deployments/artifacts/[^/]+/download' } }
    ]
  },
  {
    name: defaultPermissionSets.ReadUsers.value,
    action: 'Read',
    object: 'User management',
    description: 'Set of permissions which allows user to view other users',
    permissions: [{ action: 'http', object: { type: 'GET', value: '^/api/management/(v[1-9])/useradm/' } }]
  },
  {
    name: defaultPermissionSets.ManageUsers.value,
    action: 'Manage',
    object: 'User management',
    description: 'Set of permissions which allows user manage other user accounts',
    permissions: [{ action: 'http', object: { type: 'any', value: '^/api/management/(v[1-9])/useradm/' } }]
  },
  {
    name: defaultPermissionSets.ReadAuditLogs.value,
    action: 'Read',
    object: 'System audit log',
    description: 'Set of permissions which allows user to view system audit log',
    permissions: [{ action: 'http', object: { type: 'GET', value: '^/api/management/(v[1-9]|0.1.0)/auditlogs/logs' } }]
  },
  {
    name: defaultPermissionSets.DeployToDevices.value,
    action: 'Deploy',
    object: 'Device groups',
    description: 'Set of permissions which allows user to deploy to devices',
    permissions: [{ action: 'http', object: { type: 'any', value: '^/api/management/(v[1-9])/(deployments|deviceconfig)/' } }],
    supported_scope_types: ['DeviceGroups']
  },
  {
    name: defaultPermissionSets.ConnectToDevices.value,
    action: 'Connect',
    object: 'Device groups',
    description: 'Set of permissions which allows user to use remote terminal and file transfer',
    permissions: [
      { action: 'http', object: { type: 'GET', value: '^/api/management/(v[1-9]|0.1.0)/deviceconnect/devices/[^/]+/connect$' } },
      { action: 'http', object: { type: 'GET', value: '^/api/management/(v[1-9]|0.1.0)/deviceconnect/devices/[^/]+/download\\?path=[^\u0026]+$' } },
      { action: 'http', object: { type: 'PUT', value: '^/api/management/(v[1-9]|0.1.0)/deviceconnect/devices/[^/]+/upload$' } }
    ],
    supported_scope_types: ['DeviceGroups']
  },
  {
    name: defaultPermissionSets.SuperUser.value,
    action: 'Any',
    object: 'Any',
    description: 'Set of permissions which allows user to do anything',
    permissions: [{ action: 'any', object: { type: 'any', value: 'any' } }]
  },
  {
    name: defaultPermissionSets.UploadArtifacts.value,
    action: 'Upload',
    object: 'Artifacts',
    description: 'Set of permissions which allows user to upload artifacts',
    permissions: [
      { action: 'http', object: { type: 'POST', value: '^/api/management/v1/deployments/artifacts' } },
      { action: 'http', object: { type: 'POST', value: '^/api/management/v1/deployments/artifacts/generate' } }
    ]
  },
  {
    name: defaultPermissionSets.ReadDevices.value,
    action: 'Read',
    object: 'Device groups',
    description: 'Set of permissions which allows user to view devices',
    permissions: [
      { action: 'http', object: { type: 'POST', value: '^/api/management/v2/inventory/filters/search' } },
      { action: 'http', object: { type: 'POST', value: '^/api/management/v1/reporting/devices/search' } },
      { action: 'http', object: { type: 'GET', value: '^/api/management/(v[1-9])/(deployments|devauth|inventory|deviceconfig|devicemonitor)/' } },
      { action: 'http', object: { type: 'GET', value: '^/api/management/(v[1-9]|0.1.0)/deviceconnect/devices/[^/]+$' } }
    ],
    supported_scope_types: ['DeviceGroups']
  },
  {
    name: defaultPermissionSets.ManageDevices.value,
    action: 'Manage',
    object: 'Device groups',
    description: 'Set of permissions which allows user to manage devices',
    permissions: [
      { action: 'http', object: { type: 'POST', value: '^/api/management/(v[1-9])/(devauth|inventory)/' } },
      { action: 'http', object: { type: 'PUT', value: '^/api/management/(v[1-9])/(devauth|inventory)/' } },
      { action: 'http', object: { type: 'DELETE', value: '^/api/management/(v[1-9])/(devauth|inventory)/' } }
    ],
    supported_scope_types: ['DeviceGroups']
  },
  {
    name: defaultPermissionSets.ReadReleases.value,
    action: 'Read',
    object: 'Releases',
    description: 'Set of permissions which allows user to view releases',
    permissions: [
      { action: 'http', object: { type: 'GET', value: '^/api/management/v1/deployments/artifacts' } },
      { action: 'http', object: { type: 'GET', value: '^/api/management/v1/deployments/artifacts/[^/]+' } },
      { action: 'http', object: { type: 'GET', value: '^/api/management/v1/deployments/artifacts/[^/]+/download' } }
    ]
  }
];

const expectedParsedRoles = {
  '141sasd': {
    editable: true,
    isCustom: undefined,
    uiPermissions: {
      ...emptyUiPermissions,
      groups: { bestgroup: [uiPermissionsById.connect.value, uiPermissionsById.read.value] },
      userManagement: [uiPermissionsById.manage.value]
    }
  },
  asdasd: {
    editable: false,
    isCustom: true,
    uiPermissions: { ...emptyUiPermissions, userManagement: [uiPermissionsById.read.value, uiPermissionsById.manage.value] }
  },
  dyn: {
    editable: false,
    isCustom: true,
    uiPermissions: {
      ...emptyUiPermissions,
      deployments: [uiPermissionsById.deploy.value],
      groups: { dyn: [uiPermissionsById.read.value, uiPermissionsById.deploy.value] }
    }
  },
  kljlkk: { editable: true, isCustom: false, uiPermissions: { ...emptyUiPermissions, groups: { bestgroup: [uiPermissionsById.connect.value] } } },
  yyyyy: {
    editable: true,
    isCustom: undefined,
    uiPermissions: { ...emptyUiPermissions, groups: { dockerclient: [uiPermissionsById.manage.value] }, releases: [uiPermissionsById.manage.value] }
  }
};

export const receivedRoles = rbacRoles.reduce(
  (accu, role) => {
    const { name, description, ...roleRemainder } = role;
    if (name.startsWith('RBAC')) {
      accu[name] = {
        ...defaultState.users.rolesById[name],
        ...roleRemainder,
        name,
        editable: false,
        isCustom: false,
        description: defaultState.users.rolesById[name].description ? defaultState.users.rolesById[name].description : description
      };
    } else {
      const result = expectedParsedRoles[name] ?? {};
      accu[name] = {
        ...emptyRole,
        ...role,
        ...result,
        title: name
      };
    }
    return accu;
  },
  { ...defaultState.users.rolesById }
);

export const receivedPermissionSets = permissionSets.reduce((accu, set) => {
  const result = defaultPermissionSets[set.name]?.result ?? {};
  accu[set.name] = {
    ...set,
    result: {
      ...emptyUiPermissions,
      ...result
    }
  };
  return accu;
}, {});
