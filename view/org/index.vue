<template>
  <div class="admin-organization-mgmt-wrapper full-height q-pa-md">
    <q-tree
      :nodes="(data && data.total) ? data.docs : []"
      ref="orgTree"
      accordion
      no-connectors
      node-key="id"
      label-key="Name"
      @lazy-load="loadSubOrgs"
      @update:expanded="onNodeExpanded"
    >
      <template v-slot:default-header="prop">
        <div
          class="organization-header row items-center full-width"
          style="border-bottom: solid 1px grey;"
        >
          <div :class="prop.node.IsVirtual ? 'virtual' : ''">
            {{ prop.node.Name }}
            <!-- <e-icon v-if="prop.node.IsVirtual" name="public"></e-icon> -->
          </div>
          <q-space></q-space>

          <span class="flex justify-start action-buttons">
            <q-btn
              v-if="prop.node.addingNew"
              flat
              icon="add"
              @click.stop="addNode(prop.node)"
            ></q-btn>
            <q-btn
              v-if="!prop.node.addingNew"
              flat
              icon="edit"
              @click.stop="editNode(prop.node)"
            ></q-btn>
            <q-btn
              v-if="!prop.node.addingNew"
              flat
              icon="delete"
              @click.stop="deleteNode(prop.node)"
            ></q-btn>
          </span>

          <!-- <q-btn v-if="prop.node.addingNew" flat
            icon="add" @click.stop="addNode(prop.node)"></q-btn>
          <q-btn v-if="!prop.node.addingNew" flat
            icon="edit" @click.stop="editNode(prop.node)"></q-btn>
          <q-btn v-if="!prop.node.addingNew" flat
            icon="delete" @click.stop="deleteNode(prop.node)"></q-btn> -->
        </div>
      </template>

      <template v-slot:default-body="prop">
        <div
          v-if="prop.node.id === selectedOrgNode.id"
          class="full-width"
        >

          <free-field
            v-for="(field, fIndex) in orgFields || []"
            :key="fIndex"
            :values="editingOrg"
            :Field="field"
          ></free-field>

          <div class="action-btns full-width row justify-center q-gutter-md">
            <q-btn
              :label="$t('saveButtonText')"
              class="btn-primary"
              @click="onSaveClick"
            />
            <q-btn
              :label="$t('cancelButtonText')"
              class="btn-secondary"
              @click="onCancelClick"
            />
          </div>

          <sticky-buttons
            :actions="[
              {Action: 'cancel', icon:'cancel', Label:$t('cancelButtonText')},
              {Action: 'save', icon: 'save', Label:$t('saveButtonText')}
            ]"
            @click="stickyButtonClicked"
          ></sticky-buttons>
        </div>
      </template>
    </q-tree>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import { useObjectData, objectDataProps } from 'free-fe-core-modules/composible/useObjectData';

export default defineComponent({
  name: 'OrganizationPage',
  mixins: [mixins.ObjectDataMixin],
  props: {
    ...objectDataProps,
    addOrg: { type: Function, default: () => { } },
    editOrg: { type: Function, default: () => { } },
    deleteOrg: { type: Function, default: () => { } },
  },
  setup(props, ctx) {
    const {
      data,
      refreshData,
    } = useObjectData(props, ctx);

    return {
      data, 
      refreshData,
    };
  },
  data() {
    return {
      selectedOrgNode: {},
      editingOrg: {},
      orgFields: [],
    };
  },
  watch: {},
  created() {
    this.orgFields = this.getModule(
      'account',
    ).config.orgFields;
  },
  methods: {
    loadSubOrgs({ key, done, node /* , fail */ }) {
      this.GetData(key, node.level)
        .then((d) => {
          if (!d || !d.total || !d.docs) done([]);
          else {
            done(d.docs);
          }
        })
        .catch(() => {
          done([]);
        });
    },
    addNode(n) {
      if (this.selectedOrgNode && this.selectedOrgNode.id === n.id) {
        this.selectedOrgNode = {};
        this.editingOrg = {};
        this.$refs.orgTree.setExpanded(n.id, false);
      } else {
        this.selectedOrgNode = n;
        this.editingOrg = {
          IsVirtual: false,
        };
      }
    },
    editNode(n) {
      if (this.selectedOrgNode.id === n.id) {
        this.selectedOrgNode = {};
        this.editingOrg = {};
        this.$refs.orgTree.setExpanded(n.id, false);
      } else {
        this.selectedOrgNode = n;
        this.editingOrg = { ...n };
        this.$refs.orgTree.setExpanded(n.id, true);
      }
    },
    deleteNode(n) {
      if (n.addingNew || !n.id) return;

      this.$MsgDialog({
        type: '',
        content: `确认要删除组织机构 '${n.Name}' 吗?`,
        canCancel: true,
        okText: this.$t('okButtonText'),
        cancelText: this.$t('cancelButtonText'),
      })
        .then(() => {
          this.deleteOrg(n.id).then((d) => {
            if (d && d.msg === 'OK') {
              this.refreshData();
            }
          });
        })
        .catch(() => { });
    },
    onSaveClick() {
      if (Object.keys(this.editingOrg) <= 0) return;
      // if is adding new
      if (this.selectedOrgNode.addingNew) {
        this.editingOrg = {
          lazy: true,
          Parent: this.selectedOrgNode.Parent,
          level: this.selectedOrgNode.level,
          ...this.editingOrg,
        };

        // fix: the default content for number input will be string!!!!????
        // convert to number
        this.editingOrg.Index = Number(this.editingOrg.Index || '0');

        this.addOrg(this.editingOrg).then((r) => {
          if (r && r.msg === 'OK') {
            const parent = this.$refs.orgTree.getNodeByKey(
              this.selectedOrgNode.Parent,
            );
            if (parent) {
              parent.children.push({ id: r.data.id, ...this.editingOrg });
              parent.children = parent.children.sort(
                (a, b) => (a ? a.Index : 0) - (b ? b.Index : 0),
              );
            } else {
              this.data.docs.push({ id: r.data.id, ...this.editingOrg });
              this.data.docs = this.data.docs.sort(
                (a, b) => (a ? a.Index : 0) - (b ? b.Index : 0),
              );
            }
          } else {
            this.$q.notify((r && r.msg) || this.$t('notifyAddFailed'));
          }

          this.editingOrg = {};
          this.selectedOrgNode = {};
        });
      } else {
        // editing
        const updatingOrg = { ...this.editingOrg };
        delete updatingOrg.children;
        delete updatingOrg.level;
        delete updatingOrg.lazy;
        this.editOrg(updatingOrg).then((r) => {
          if (r && r.msg === 'OK') {
            let currentNode = this.$refs.orgTree.getNodeByKey(
              this.editingOrg.id,
            );
            if (currentNode) {
              currentNode = Object.assign(currentNode, this.editingOrg);
            }

            // order
            const parent = this.$refs.orgTree.getNodeByKey(
              this.selectedOrgNode.Parent,
            );
            if (parent) {
              parent.children = parent.children.sort(
                (a, b) => (a ? a.Index : 0) - (b ? b.Index : 0),
              );
            } else {
              this.data.docs = this.data.docs.sort(
                (a, b) => (a ? a.Index : 0) - (b ? b.Index : 0),
              );
            }
          }

          this.editingOrg = {};
          this.selectedOrgNode = {};
        });
      }
    },
    onCancelClick() {
      this.editingOrg = {};
      this.selectedOrgNode = {};
    },
    onNodeExpanded() {
      this.editingOrg = {};
      this.selectedOrgNode = {};
    },
    stickyButtonClicked(a) {
      if (!a || !a.Action) return;

      if (a.Action === 'save') {
        this.onSaveClick();
      } else if (a.Action === 'cancel') {
        this.onCancelClick();
      }
    },
  },
});
</script>