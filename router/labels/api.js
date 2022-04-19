// import Vue from 'vue';
import { requests } from 'boot/axios';

export function getLabels() {
  return requests.getRequest('account/label');
}

export function createLabel(data) {
  return requests.postRequest('account/label', data);
}

export function updateLabel(data) {
  return requests.putRequest('account/label', data);
}

export function deleteLabel(id) {
  return requests.deleteRequest('account/label', { id });
}
