<template>
  <div class="admin-permission-mgmt-wrapper full-height q-pa-md">
    <q-tree
      v-if="data && data.total"
      :nodes="(data && data.total) ? data.docs : []"
      ref="permTree"
      accordion
      node-key="id"
      label-key="Title"
      @lazy-load="loadSubPerms"
      @update:expanded="onNodeExpanded"
    >
      <template v-slot:default-header="prop">
        <div
          class="row items-center full-width"
          style="border-bottom: solid 1px grey;"
        >
          <div>
            {{ prop.node.Title }}<span>({{prop.node.Name}})</span>
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
            :disabled="prop.node.BuiltIn"
            flat
            icon="delete"
            @click.stop="deleteNode(prop.node)"
          ></q-btn>
        </div>
      </template>

      <template v-slot:default-body="prop">
        <div
          v-if="prop.node.id === selectedPermNode.id"
          class="full-width"
        >
          <free-field
            v-for="(field, fIndex) in data.Fields || []"
            :key="fIndex"
            :values="editingPerm"
            :Field="field"
            ref="fieldsToValidate"
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

    <q-tree
      v-else
      :nodes="skeletonNodes"
      node-key="id"
      label-key="Title"
    >
      <template v-slot:default-header>
        <div
          class="row items-center full-width"
          style="border-bottom: solid 1px grey;"
        >
          <div class="row">
            <q-skeleton
              type="rect"
              width="300px"
            />
          </div>
          <q-space></q-space>
          <q-btn
            flat
            icon="edit"
          ></q-btn>
          <q-btn
            flat
            icon="delete"
          ></q-btn>
        </div>
      </template>
    </q-tree>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import { useObjectData, objectDataProps } from 'free-fe-core-modules/composible/useObjectData';
import { useFormValidator} from 'free-fe-core-modules/composible/useFormValidator';

export default defineComponent({
  name: 'PermissionPage',
  props: {
    ...objectDataProps,
    addPerm: { type: Function, default: () => { } },
    editPerm: { type: Function, default: () => { } },
    deletePerm: { type: Function, default: () => { } },
  },
  setup(props, ctx) {
    const {
      data,
      refreshData,
    } = useObjectData(props, ctx);

    const { validate } = useFormValidator('fieldsToValidate');

    return {
      data,
      refreshData,
      validate,
    };
  },
  data() {
    return {
      selectedPermNode: {},
      editingPerm: {},
      skeletonNodes: [
        {
          id: '1',
          Title: '',
        },
        {
          id: '2',
          Title: '',
        },
        {
          id: '3',
          Title: '',
        },
        {
          id: '4',
          Title: '',
        },
      ],
    };
  },
  methods: {
    loadSubPerms({ key, done, node /* , fail */ }) {
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
      if (this.selectedPermNode && this.selectedPermNode.id === n.id) {
        this.selectedPermNode = {};
        this.editingPerm = {};
        this.$refs.permTree.setExpanded(n.id, false);
      } else {
        this.selectedPermNode = n;
        this.editingPerm = {
          Type: 'String',
        };
      }
    },
    editNode(n) {
      if (this.selectedPermNode && this.selectedPermNode.id === n.id) {
        this.selectedPermNode = {};
        this.editingPerm = {};
        this.$refs.permTree.setExpanded(n.id, false);
      } else {
        this.selectedPermNode = n;
        this.editingPerm = { ...n };
        this.$refs.permTree.setExpanded(n.id, true);
      }
    },
    deleteNode(n) {
      if (n.addingNew || !n.id) return;

      this.$MsgDialog({
        type: '',
        content: this.$t('删除确认', { type: this.$t('权限定义'), name: n.Name }),
        canCancel: true,
        okText: this.$t('okButtonText'),
        cancelText: this.$t('cancelButtonText'),
      })
        .then(() => {
          this.deletePerm(n.id).then((d) => {
            if (d && d.msg === 'OK') {
              this.refreshData();
            }
          });
        })
        .catch(() => { });
    },
    onSaveClick() {
      if (Object.keys(this.editingPerm) <= 0) return;

      if (!this.validate()) return;

      // if is adding new
      if (this.selectedPermNode.addingNew) {
        this.editingPerm = {
          lazy: true,
          Parent: this.selectedPermNode.Parent,
          level: this.selectedPermNode.level,
          ...this.editingPerm,
        };

        // fix: the default content for number input will be string!!!!????
        // convert to number
        this.editingPerm.Index = Number(this.editingPerm.Index || '0');

        this.addPerm(this.editingPerm).then((r) => {
          if (r && r.msg === 'OK') {
            const parent = this.$refs.permTree.getNodeByKey(
              this.selectedPermNode.Parent,
            );
            if (parent) {
              parent.children.push(
                { id: r.data.id, ...this.editingPerm },
              );
              parent.children = parent.children.sort(
                (a, b) => (a ? a.Index : 0) - (b ? b.Index : 0),
              );
            } else {
              this.data.docs.push(
                { id: r.data.id, ...this.editingPerm },
              );
              this.data.docs = this.data.docs.sort(
                (a, b) => (a ? a.Index : 0) - (b ? b.Index : 0),
              );
            }

            this.$q.notify(this.$t('notifySaved'));
          } else {
            this.$q.notify((r && r.msg) || this.$t('notifyAddFailed'));
          }

          this.editingPerm = {};
          this.selectedPermNode = {};
        });
      } else {
        // editing
        const updatingPerm = { ...this.editingPerm };
        delete updatingPerm.children;
        delete updatingPerm.level;
        delete updatingPerm.lazy;
        this.editPerm(updatingPerm).then((r) => {
          if (r && r.msg === 'OK') {
            let currentNode = this.$refs.permTree.getNodeByKey(
              this.editingPerm.id,
            );
            if (currentNode) {
              currentNode = Object.assign(currentNode, this.editingPerm);
            }

            // order
            const parent = this.$refs.permTree.getNodeByKey(
              this.selectedPermNode.Parent,
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

            this.$q.notify(this.$t('notifySaved'));
          }

          this.editingPerm = {};
          this.selectedPermNode = {};
        });
      }
    },
    onCancelClick() {
      this.editingPerm = {};
      this.selectedPermNode = {};
    },
    onNodeExpanded() {
      this.editingPerm = {};
      this.selectedPermNode = {};
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
