// import Vue from 'vue';
import { requests } from 'boot/axios';

export function getAccount(o) {
  return requests.getRequest('account/mgmt', o);
}

export function getOneAccount(id) {
  if (!id) return {};
  return requests.getRequest(`account/mgmt/${id}`);
}

export function createAccount() {
  return requests.postRequest('account/mgmt', { CreatedDate: new Date() });
}

export function updateAccount(o) {
  return requests.putRequest('account/mgmt', o);
}

export function resetAccountPwd(id) {
  return requests.postRequest(`account/mgmt/${id}/resetpwd`);
}
