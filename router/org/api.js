// import Vue from 'vue';
import { requests } from 'boot/axios';

export function getOrgs (p) {
  return requests.getRequest('account/org', p ? { Parent: p } : {});
}

export function createOrg(data) {
  return requests.postRequest('account/org', data);
}

export function updateOrg(data) {
  return requests.putRequest('account/org', data);
}

export function deleteOrg(id) {
  return requests.deleteRequest('account/org', { id });
}
