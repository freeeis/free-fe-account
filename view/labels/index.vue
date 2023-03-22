<template>
  <div class="admin-labels-mgmt-wrapper full-height q-pa-md">
    <q-tree
      :nodes="(data && data.total) ? data.docs : []"
      ref="labelTree"
      accordion
      node-key="id"
      label-key="Name"
      @update:expanded="onNodeExpanded"
    >
      <template v-slot:default-header="prop">
        <div
          class="label-header row items-center full-width"
        >
          <div :class="{disabled: (!prop.node.Enabled && !prop.node.addingNew)}">
            {{ prop.node.Name }}
          </div>
          <q-space></q-space>
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
        </div>
      </template>

      <template v-slot:default-body="prop">
        <div
          v-if="prop.node.id === selectedLabelNode.id"
          class="full-width"
        >
          <free-field
            v-for="(field, fIndex) in labelFields || []"
            :key="fIndex"
            :values="editingLabel"
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
  name: 'LabelPage',
  props: {
    ...objectDataProps,
    addLabel: { type: Function, default: () => { } },
    editLabel: { type: Function, default: () => { } },
    deleteLabel: { type: Function, default: () => { } },
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
      selectedLabelNode: {},
      editingLabel: {},
      labelFields: [],
    };
  },
  watch: {},
  created() {
    this.labelFields = this.getModule('account').config.labelFields;
  },
  methods: {
    addNode(n) {
      if (this.selectedLabelNode && this.selectedLabelNode.id === n.id) {
        // already selected, close
        this.selectedLabelNode = {};
        this.editingLabel = {};
        this.$refs.labelTree.setExpanded(n.id, false);
      } else {
        this.selectedLabelNode = n;
        this.editingLabel = {
          Enabled: true,
        };
        this.selectedLabelNode = n;
      }
    },
    editNode(n) {
      if (this.selectedLabelNode && this.selectedLabelNode.id === n.id) {
        // already selected, close
        this.selectedLabelNode = {};
        this.editingLabel = {};
        this.$refs.labelTree.setExpanded(n.id, false);
      } else {
        this.selectedLabelNode = n;
        this.editingLabel = { ...n };
        this.$refs.labelTree.setExpanded(n.id, true);
      }
    },
    deleteNode(n) {
      if (n.addingNew || !n.id) return;

      this.$MsgDialog({
        type: '',
        content: `确认要删除标签 '${n.Name}' 吗?`,
        canCancel: true,
        okText: this.$t('okButtonText'),
        cancelText: this.$t('cancelButtonText'),
      })
        .then(() => {
          this.deleteLabel(n.id).then((d) => {
            if (d && d.msg === 'OK') {
              this.refreshData();
            }
          });
        })
        .catch(() => { });
    },
    onSaveClick() {
      if (Object.keys(this.editingLabel) <= 0) return;
      // if is adding new
      if (this.selectedLabelNode.addingNew) {
        // fix: the default content for number input will be string!!!!????
        // convert to number
        this.editingLabel.Index = Number(this.editingLabel.Index || '0');

        this.addLabel(this.editingLabel).then((r) => {
          if (r && r.msg === 'OK') {
            this.data.docs.push(
              { id: r.data.id, ...this.editingLabel },
            );
            this.data.docs = this.data.docs.sort(
              (a, b) => (a ? a.Index : 0) - (b ? b.Index : 0),
            );
            this.$q.notify(this.$t('notifySaved'));
          } else {
            this.$q.notify((r && r.msg) || this.$t('notifyAddFailed'));
          }

          this.editingLabel = {};
          this.selectedLabelNode = {};
        });
      } else {
        // editing
        this.editLabel(this.editingLabel).then((r) => {
          if (r && r.msg === 'OK') {
            let currentNode = this.$refs.labelTree.getNodeByKey(
              this.editingLabel.id,
            );
            if (currentNode) {
              currentNode = Object.assign(currentNode, this.editingLabel);
            }

            // order
            this.data.docs = this.data.docs.sort(
              (a, b) => (a ? a.Index : 0) - (b ? b.Index : 0),
            );

            this.$q.notify(this.$t('notifySaved'));
          } else {
            this.$q.notify((r && r.msg) || this.$t('notifySaveFailed'));
          }

          this.editingLabel = {};
          this.selectedLabelNode = {};
        });
      }
    },
    onCancelClick() {
      this.editingLabel = {};
      this.selectedLabelNode = {};
    },
    onNodeExpanded() {
      this.editingLabel = {};
      this.selectedLabelNode = {};
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

<style lang="sass" scoped>
.admin-labels-mgmt-wrapper
  .label-header
    .disabled
      opacity: 0.6
      text-decoration: line-through
</style>
