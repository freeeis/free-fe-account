<template>
  <div class="q-pa-md">
    <q-btn @click="onBtnClick">dialog</q-btn>
    <div
      style="font-family: HelveticaInseratCyr-Upright, HelveticaInseratCyr;">
      Orgs: {{ data.total }}
    </div>
    <q-table
      :title="$t('USER-CENTER')"
      :rows="data.docs"
      :columns="columns"
      row-key="name"
    />
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import { useObjectData, objectDataProps } from 'free-fe-core-modules/composible/useObjectData';

export default defineComponent({
  name: 'UcPage',
  props: {
    ...objectDataProps,
    selectedOrg: { type: String, default: '' },
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
      columns: [
        {
          name: 'name',
          required: true,
          label: 'Name',
          align: 'left',
          field: (row) => row.Name,
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: 'index',
          align: 'center',
          label: 'Index',
          field: 'Index',
          sortable: true,
        },
        {
          name: 'description',
          label: 'Description',
          field: 'Description',
          sortable: false,
        },
      ],
    };
  },
  methods: {
    onBtnClick() {
      this.$MsgDialog({ content: 'This is the content of the dialog', type: 'warning', canCancel: true });
    },
  },
});
</script>
