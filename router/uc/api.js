// import Vue from 'vue';
import { requests } from 'boot/axios';

export function changePwd(o) {
  return requests.putRequest('account/uc/pwd', o);
}

export function changePhone(o) {
  return requests.putRequest('account/uc/phone', o);
}

export function getSubAccounts(o) {
  return requests.getRequest('account/uc/sub', o);
}

export function getSubAccount(id) {
  if (id) { return requests.getRequest(`account/uc/sub/${id}`); }
  return undefined;
}

export function updateSubAccount(id, o) {
  return requests.putRequest(`account/uc/sub/${id}`, o);
}

export function createSubAccount(o) {
  return requests.postRequest('account/uc/sub', o);
}

export function deleteSubAccount(id) {
  if (id) { return this.deleteRequest(`account/uc/sub/${id}`); }
  return undefined;
}

export function getMyInfo() {
  return requests.getRequest('account/uc/info');
}

export function updateMyInfo(o) {
  return requests.putRequest('account/uc/info', o);
}

export function submitMyInfo(d) {
  return requests.postRequest('account/uc/info/submit', d);
}

export function editMyInfo() {
  return requests.postRequest('account/uc/info/edit');
}
