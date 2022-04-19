// import Vue from 'vue';
import { requests } from 'boot/axios';

export function getPerm (p) {
  return requests.getRequest('account/perm', p ? { Parent: p } : {});
}

export function createPerm(data) {
  return requests.postRequest('account/perm', data);
}

export function updatePerm(data) {
  return requests.putRequest('account/perm', data);
}

export function deletePerm(id) {
  return requests.deleteRequest('account/perm', { id });
}
