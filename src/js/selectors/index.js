// Copyright 2020 Northern.tech AS
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
import { createSelector } from '@reduxjs/toolkit';

import { defaultReports } from '../actions/deviceActions';
import { mapUserRolesToUiPermissions } from '../actions/userActions';
import { PLANS } from '../constants/appConstants';
import { DEPLOYMENT_STATES } from '../constants/deploymentConstants';
import {
  ALL_DEVICES,
  ATTRIBUTE_SCOPES,
  DEVICE_ISSUE_OPTIONS,
  DEVICE_LIST_MAXIMUM_LENGTH,
  DEVICE_ONLINE_CUTOFF,
  DEVICE_STATES,
  EXTERNAL_PROVIDER,
  UNGROUPED_GROUP
} from '../constants/deviceConstants';
import { rolesByName, twoFAStates, uiPermissionsById } from '../constants/userConstants';
import { attributeDuplicateFilter, duplicateFilter, getDemoDeviceAddress as getDemoDeviceAddressHelper, versionCompare } from '../helpers';

const getAppDocsVersion = state => state.app.docsVersion;
export const getFeatures = state => state.app.features;
export const getRolesById = state => state.users.rolesById;
export const getOrganization = state => state.organization.organization;
export const getAcceptedDevices = state => state.devices.byStatus.accepted;
const getDevicesByStatus = state => state.devices.byStatus;
export const getDevicesById = state => state.devices.byId;
export const getDeviceReports = state => state.devices.reports;
export const getGroupsById = state => state.devices.groups.byId;
const getSelectedGroup = state => state.devices.groups.selectedGroup;
const getSearchedDevices = state => state.app.searchState.deviceIds;
const getListedDevices = state => state.devices.deviceList.deviceIds;
const getFilteringAttributes = state => state.devices.filteringAttributes;
export const getDeviceFilters = state => state.devices.filters || [];
const getFilteringAttributesFromConfig = state => state.devices.filteringAttributesConfig.attributes;
export const getSortedFilteringAttributes = createSelector([getFilteringAttributes], filteringAttributes => ({
  ...filteringAttributes,
  identityAttributes: [...filteringAttributes.identityAttributes, 'id']
}));
export const getDeviceLimit = state => state.devices.limit;
const getDevicesList = state => Object.values(state.devices.byId);
const getOnboarding = state => state.onboarding;
export const getShowHelptips = state => state.users.showHelptips;
export const getGlobalSettings = state => state.users.globalSettings;
const getIssueCountsByType = state => state.monitor.issueCounts.byType;
export const getReleasesById = state => state.releases.byId;
const getReleaseTags = state => state.releases.releaseTags;
const getListedReleases = state => state.releases.releasesList.releaseIds;
export const getExternalIntegrations = state => state.organization.externalDeviceIntegrations;
const getDeploymentsById = state => state.deployments.byId;
export const getDeploymentsByStatus = state => state.deployments.byStatus;
export const getVersionInformation = state => state.app.versionInformation;
const getCurrentUserId = state => state.users.currentUser;
const getUsersById = state => state.users.byId;
export const getCurrentUser = createSelector([getUsersById, getCurrentUserId], (usersById, userId) => usersById[userId] ?? {});
export const getUserSettings = state => state.users.userSettings;
export const getIsPreview = createSelector([getVersionInformation], ({ Integration }) => versionCompare(Integration, 'next') > -1);

export const getDeploymentsSelectionState = state => state.deployments.selectionState;

export const getMappedDeploymentSelection = createSelector(
  [getDeploymentsSelectionState, (_, deploymentsState) => deploymentsState, getDeploymentsById],
  (selectionState, deploymentsState, deploymentsById) => {
    const { selection = [] } = selectionState[deploymentsState] ?? {};
    return selection.reduce((accu, id) => {
      if (deploymentsById[id]) {
        accu.push(deploymentsById[id]);
      }
      return accu;
    }, []);
  }
);

export const getDeploymentRelease = createSelector(
  [getDeploymentsById, getDeploymentsSelectionState, getReleasesById],
  (deploymentsById, { selectedId }, releasesById) => {
    const deployment = deploymentsById[selectedId] || {};
    return deployment.artifact_name && releasesById[deployment.artifact_name] ? releasesById[deployment.artifact_name] : { device_types_compatible: [] };
  }
);

export const getHas2FA = createSelector(
  [getCurrentUser],
  currentUser => currentUser.hasOwnProperty('tfa_status') && currentUser.tfa_status === twoFAStates.enabled
);

export const getDemoDeviceAddress = createSelector([getDevicesList, getOnboarding], (devices, { approach, demoArtifactPort }) => {
  const demoDeviceAddress = `http://${getDemoDeviceAddressHelper(devices, approach)}`;
  return demoArtifactPort ? `${demoDeviceAddress}:${demoArtifactPort}` : demoDeviceAddress;
});

export const getDeviceReportsForUser = createSelector(
  [getUserSettings, getCurrentUserId, getGlobalSettings, getDevicesById],
  ({ reports }, currentUserId, globalSettings, devicesById) => {
    return reports || globalSettings[`${currentUserId}-reports`] || (Object.keys(devicesById).length ? defaultReports : []);
  }
);

const listItemMapper = (byId, ids, { defaultObject = {}, cutOffSize = DEVICE_LIST_MAXIMUM_LENGTH }) => {
  return ids.slice(0, cutOffSize).reduce((accu, id) => {
    if (id && byId[id]) {
      accu.push({ ...defaultObject, ...byId[id] });
    }
    return accu;
  }, []);
};

const listTypeDeviceIdMap = {
  deviceList: getListedDevices,
  search: getSearchedDevices
};
const getDeviceMappingDefaults = () => ({ defaultObject: { auth_sets: [] }, cutOffSize: DEVICE_LIST_MAXIMUM_LENGTH });
export const getMappedDevicesList = createSelector(
  [getDevicesById, (state, listType) => listTypeDeviceIdMap[listType](state), getDeviceMappingDefaults],
  listItemMapper
);

export const getDeviceCountsByStatus = createSelector([getDevicesByStatus], byStatus =>
  Object.values(DEVICE_STATES).reduce((accu, state) => {
    accu[state] = byStatus[state].total || 0;
    return accu;
  }, {})
);

export const getDeviceById = createSelector([getDevicesById, (_, deviceId) => deviceId], (devicesById, deviceId = '') => devicesById[deviceId] ?? {});

export const getDeviceConfigDeployment = createSelector([getDeviceById, getDeploymentsById], (device, deploymentsById) => {
  const { config = {} } = device;
  const { deployment_id: configDeploymentId } = config;
  const deviceConfigDeployment = deploymentsById[configDeploymentId] || {};
  return { device, deviceConfigDeployment };
});

export const getSelectedGroupInfo = createSelector(
  [getAcceptedDevices, getGroupsById, getSelectedGroup],
  ({ total: acceptedDeviceTotal }, groupsById, selectedGroup) => {
    let groupCount = acceptedDeviceTotal;
    let groupFilters = [];
    if (selectedGroup && groupsById[selectedGroup]) {
      groupCount = groupsById[selectedGroup].total;
      groupFilters = groupsById[selectedGroup].filters || [];
    }
    return { groupCount, selectedGroup, groupFilters };
  }
);

const defaultIdAttribute = Object.freeze({ attribute: 'id', scope: ATTRIBUTE_SCOPES.identity });
export const getIdAttribute = createSelector([getGlobalSettings], ({ id_attribute = { ...defaultIdAttribute } }) => id_attribute);

export const getLimitMaxed = createSelector([getAcceptedDevices, getDeviceLimit], ({ total: acceptedDevices = 0 }, deviceLimit) =>
  Boolean(deviceLimit && deviceLimit <= acceptedDevices)
);

export const getFilterAttributes = createSelector(
  [getGlobalSettings, getFilteringAttributes],
  ({ previousFilters }, { identityAttributes, inventoryAttributes, systemAttributes, tagAttributes }) => {
    const deviceNameAttribute = { key: 'name', value: 'Name', scope: ATTRIBUTE_SCOPES.tags, category: ATTRIBUTE_SCOPES.tags, priority: 1 };
    const deviceIdAttribute = { key: 'id', value: 'Device ID', scope: ATTRIBUTE_SCOPES.identity, category: ATTRIBUTE_SCOPES.identity, priority: 1 };
    const checkInAttribute = { key: 'check_in_time', value: 'Latest activity', scope: ATTRIBUTE_SCOPES.system, category: ATTRIBUTE_SCOPES.system, priority: 4 };
    const updateAttribute = { ...checkInAttribute, key: 'updated_ts', value: 'Last inventory update' };
    const firstRequestAttribute = { key: 'created_ts', value: 'First request', scope: ATTRIBUTE_SCOPES.system, category: ATTRIBUTE_SCOPES.system, priority: 4 };
    const attributes = [
      ...previousFilters.map(item => ({
        ...item,
        value: deviceIdAttribute.key === item.key ? deviceIdAttribute.value : item.key,
        category: 'recently used',
        priority: 0
      })),
      deviceNameAttribute,
      deviceIdAttribute,
      ...identityAttributes.map(item => ({ key: item, value: item, scope: ATTRIBUTE_SCOPES.identity, category: ATTRIBUTE_SCOPES.identity, priority: 1 })),
      ...inventoryAttributes.map(item => ({ key: item, value: item, scope: ATTRIBUTE_SCOPES.inventory, category: ATTRIBUTE_SCOPES.inventory, priority: 2 })),
      ...tagAttributes.map(item => ({ key: item, value: item, scope: ATTRIBUTE_SCOPES.tags, category: ATTRIBUTE_SCOPES.tags, priority: 3 })),
      checkInAttribute,
      updateAttribute,
      firstRequestAttribute,
      ...systemAttributes.map(item => ({ key: item, value: item, scope: ATTRIBUTE_SCOPES.system, category: ATTRIBUTE_SCOPES.system, priority: 4 }))
    ];
    return attributeDuplicateFilter(attributes, 'key');
  }
);

// eslint-disable-next-line no-unused-vars
export const getGroupsByIdWithoutUngrouped = createSelector([getGroupsById], ({ [UNGROUPED_GROUP.id]: ungrouped, ...groups }) => groups);

export const getGroups = createSelector([getGroupsById], groupsById => {
  const groupNames = Object.keys(groupsById).sort();
  const groupedGroups = Object.entries(groupsById)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .reduce(
      (accu, [groupname, group]) => {
        const name = groupname === UNGROUPED_GROUP.id ? UNGROUPED_GROUP.name : groupname;
        const groupItem = { ...group, groupId: name, name: groupname };
        if (group.filters.length > 0) {
          if (groupname !== UNGROUPED_GROUP.id) {
            accu.dynamic.push(groupItem);
          } else {
            accu.ungrouped.push(groupItem);
          }
        } else {
          accu.static.push(groupItem);
        }
        return accu;
      },
      { dynamic: [], static: [], ungrouped: [] }
    );
  return { groupNames, ...groupedGroups };
});

export const getDeviceTwinIntegrations = createSelector([getExternalIntegrations], integrations =>
  integrations.filter(integration => integration.id && EXTERNAL_PROVIDER[integration.provider]?.deviceTwin)
);

export const getOfflineThresholdSettings = createSelector([getGlobalSettings], ({ offlineThreshold }) => ({
  interval: offlineThreshold?.interval || DEVICE_ONLINE_CUTOFF.interval,
  intervalUnit: offlineThreshold?.intervalUnit || DEVICE_ONLINE_CUTOFF.intervalName
}));

export const getOnboardingState = createSelector([getOnboarding, getShowHelptips], ({ complete, progress, showTips, ...remainder }, showHelptips) => ({
  ...remainder,
  complete,
  progress,
  showHelptips,
  showTips
}));

export const getDocsVersion = createSelector([getAppDocsVersion, getFeatures], (appDocsVersion, { isHosted }) => {
  // if hosted, use latest docs version
  const docsVersion = appDocsVersion ? `${appDocsVersion}/` : 'development/';
  return isHosted ? '' : docsVersion;
});

export const getIsEnterprise = createSelector(
  [getOrganization, getFeatures],
  ({ plan = PLANS.os.value }, { isEnterprise, isHosted }) => isEnterprise || (isHosted && plan === PLANS.enterprise.value)
);

export const getAttributesList = createSelector(
  [getFilteringAttributes, getFilteringAttributesFromConfig],
  ({ identityAttributes = [], inventoryAttributes = [] }, { identity = [], inventory = [] }) =>
    [...identityAttributes, ...inventoryAttributes, ...identity, ...inventory].filter(duplicateFilter)
);

export const getRolesList = createSelector([getRolesById], rolesById => Object.entries(rolesById).map(([id, role]) => ({ id, ...role })));

export const getUserRoles = createSelector(
  [getCurrentUser, getRolesById, getIsEnterprise, getFeatures, getOrganization],
  (currentUser, rolesById, isEnterprise, { isHosted, hasMultitenancy }, { plan = PLANS.os.value }) => {
    const isAdmin = currentUser.roles?.length
      ? currentUser.roles.some(role => role === rolesByName.admin)
      : !(hasMultitenancy || isEnterprise || (isHosted && plan !== PLANS.os.value));
    const uiPermissions = isAdmin
      ? mapUserRolesToUiPermissions([rolesByName.admin], rolesById)
      : mapUserRolesToUiPermissions(currentUser.roles || [], rolesById);
    return { isAdmin, uiPermissions };
  }
);

const hasPermission = (thing, permission) => Object.values(thing).some(permissions => permissions.includes(permission));

export const getUserCapabilities = createSelector([getUserRoles], ({ uiPermissions }) => {
  const canManageReleases = hasPermission(uiPermissions.releases, uiPermissionsById.manage.value);
  const canReadReleases = canManageReleases || hasPermission(uiPermissions.releases, uiPermissionsById.read.value);
  const canUploadReleases = canManageReleases || hasPermission(uiPermissions.releases, uiPermissionsById.upload.value);

  const canAuditlog = uiPermissions.auditlog.includes(uiPermissionsById.read.value);

  const canReadUsers = uiPermissions.userManagement.includes(uiPermissionsById.read.value);
  const canManageUsers = uiPermissions.userManagement.includes(uiPermissionsById.manage.value);

  const canReadDevices = hasPermission(uiPermissions.groups, uiPermissionsById.read.value);
  const canWriteDevices = Object.values(uiPermissions.groups).some(
    groupPermissions => groupPermissions.includes(uiPermissionsById.read.value) && groupPermissions.length > 1
  );
  const canTroubleshoot = hasPermission(uiPermissions.groups, uiPermissionsById.connect.value);
  const canManageDevices = hasPermission(uiPermissions.groups, uiPermissionsById.manage.value);
  const canConfigure = hasPermission(uiPermissions.groups, uiPermissionsById.configure.value);

  const canDeploy = uiPermissions.deployments.includes(uiPermissionsById.deploy.value) || hasPermission(uiPermissions.groups, uiPermissionsById.deploy.value);
  const canReadDeployments = uiPermissions.deployments.includes(uiPermissionsById.read.value);

  return {
    canAuditlog,
    canConfigure,
    canDeploy,
    canManageDevices,
    canManageReleases,
    canManageUsers,
    canReadDeployments,
    canReadDevices,
    canReadReleases,
    canReadUsers,
    canTroubleshoot,
    canUploadReleases,
    canWriteDevices,
    groupsPermissions: uiPermissions.groups,
    releasesPermissions: uiPermissions.releases
  };
});

export const getTenantCapabilities = createSelector(
  [getFeatures, getOrganization, getIsEnterprise],
  (
    {
      hasAddons,
      hasAuditlogs: isAuditlogEnabled,
      hasDeviceConfig: isDeviceConfigEnabled,
      hasDeviceConnect: isDeviceConnectEnabled,
      hasMonitor: isMonitorEnabled,
      isHosted
    },
    { addons = [], plan },
    isEnterprise
  ) => {
    const canDelta = isEnterprise || plan === PLANS.professional.value;
    const hasAuditlogs = isAuditlogEnabled && (!isHosted || isEnterprise || plan === PLANS.professional.value);
    const hasDeviceConfig = hasAddons || (isDeviceConfigEnabled && (!isHosted || addons.some(addon => addon.name === 'configure' && Boolean(addon.enabled))));
    const hasDeviceConnect =
      hasAddons || (isDeviceConnectEnabled && (!isHosted || addons.some(addon => addon.name === 'troubleshoot' && Boolean(addon.enabled))));
    const hasMonitor = hasAddons || (isMonitorEnabled && (!isHosted || addons.some(addon => addon.name === 'monitor' && Boolean(addon.enabled))));
    return {
      canDelta,
      canRetry: canDelta,
      canSchedule: canDelta,
      hasAuditlogs,
      hasDeviceConfig,
      hasDeviceConnect,
      hasFullFiltering: canDelta,
      hasMonitor,
      isEnterprise
    };
  }
);

export const getAvailableIssueOptionsByType = createSelector(
  [getFeatures, getTenantCapabilities, getIssueCountsByType],
  ({ hasReporting }, { hasFullFiltering, hasMonitor }, issueCounts) =>
    Object.values(DEVICE_ISSUE_OPTIONS).reduce((accu, { isCategory, key, needsFullFiltering, needsMonitor, needsReporting, title }) => {
      if (isCategory || (needsReporting && !hasReporting) || (needsFullFiltering && !hasFullFiltering) || (needsMonitor && !hasMonitor)) {
        return accu;
      }
      accu[key] = { count: issueCounts[key].filtered, key, title };
      return accu;
    }, {})
);

export const getDeviceTypes = createSelector([getAcceptedDevices, getDevicesById], ({ deviceIds = [] }, devicesById) =>
  Object.keys(
    deviceIds.slice(0, 200).reduce((accu, item) => {
      const { device_type: deviceTypes = [] } = devicesById[item] ? devicesById[item].attributes : {};
      accu = deviceTypes.reduce((deviceTypeAccu, deviceType) => {
        if (deviceType.length > 1) {
          deviceTypeAccu[deviceType] = deviceTypeAccu[deviceType] ? deviceTypeAccu[deviceType] + 1 : 1;
        }
        return deviceTypeAccu;
      }, accu);
      return accu;
    }, {})
  )
);

export const getGroupNames = createSelector([getGroupsById, getUserRoles, (_, options = {}) => options], (groupsById, { uiPermissions }, { staticOnly }) => {
  // eslint-disable-next-line no-unused-vars
  const { [UNGROUPED_GROUP.id]: ungrouped, ...groups } = groupsById;
  if (staticOnly) {
    return Object.keys(uiPermissions.groups).sort();
  }
  return Object.keys(
    Object.entries(groups).reduce((accu, [groupName, group]) => {
      if (group.filterId || uiPermissions.groups[ALL_DEVICES]) {
        accu[groupName] = group;
      }
      return accu;
    }, uiPermissions.groups)
  ).sort();
});

const getReleaseMappingDefaults = () => ({});
export const getReleasesList = createSelector([getReleasesById, getListedReleases, getReleaseMappingDefaults], listItemMapper);

export const getReleaseTagsById = createSelector([getReleaseTags], releaseTags => releaseTags.reduce((accu, key) => ({ ...accu, [key]: key }), {}));

const relevantDeploymentStates = [DEPLOYMENT_STATES.pending, DEPLOYMENT_STATES.inprogress, DEPLOYMENT_STATES.finished];
export const DEPLOYMENT_CUTOFF = 3;
export const getRecentDeployments = createSelector([getDeploymentsById, getDeploymentsByStatus], (deploymentsById, deploymentsByStatus) =>
  Object.entries(deploymentsByStatus).reduce(
    (accu, [state, byStatus]) => {
      if (!relevantDeploymentStates.includes(state) || !byStatus.deploymentIds.length) {
        return accu;
      }
      accu[state] = byStatus.deploymentIds
        .reduce((accu, id) => {
          if (deploymentsById[id]) {
            accu.push(deploymentsById[id]);
          }
          return accu;
        }, [])
        .slice(0, DEPLOYMENT_CUTOFF);
      accu.total += byStatus.total;
      return accu;
    },
    { total: 0 }
  )
);
