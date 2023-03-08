<template>
  <div class="uc-sub-account-wrapper flow-list">
    <summary-head
      :values="data.summary"
      :Bus="Bus"
    ></summary-head>
    <q-table
      flat
      :rows="data ? data.docs : []"
      :columns="columns"
      row-key="id"
      :pagination="tablePagination"
    >
      <template
        v-slot:header-cell-status="props"
        v-if="data.Filters && data.Filters.length > 0"
      >
        <q-th
          :props="props"
          class="filter-header-cell"
        >
          <q-btn
            flat
            icon="search"
            @click="showFilters = !showFilters"
          >查询</q-btn>
        </q-th>
      </template>

      <template v-slot:top-row>
        <q-tr class="persistant-top-row full-width">
          <q-td
            class="full-width"
            colspan="100%"
          ></q-td>
        </q-tr>
        <q-tr
          v-if="showFilters"
          class="table-row filter-row"
        >
          <q-td
            colspan="100%"
            class="table-cell filter-cell"
          >
            <free-field
              :Field="{Type: 'QueryFilters', Name: 'Filters'}"
              :values="data"
              @search="querySearch"
            ></free-field>
          </q-td>
        </q-tr>
      </template>

      <template v-slot:body="props">
        <q-tr
          class="table-row"
          @click="$router.push({path: `${$route.fullPath}/${props.row.id}`})"
        >
          <q-td
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
            :class="col.name ==='status' ? 'flow-list-status-td' : ''"
          >
            <div
              v-if="col.name !== 'status'"
              class="table-cell full-width"
            >
              <span v-if="col.name === 'index'">{{props.row.index}}</span>
              <span
                v-else
                class="ellipsis"
              >{{ valueFilters(col, col.value || Object.nestValue(props.row, col.field))}}</span>
            </div>
            <div
              v-else
              :class="`table-cell step-status-wrapper
                  step-status-${props.row.Enabled} full-width row flex-start`"
            >
              <e-icon
                class="step-icon"
                :name="props.row.Enabled ? (ctx.config.successIcon || 'fas fa-check-square') : (ctx.config.failIcon || 'fas fa-ban')"
              ></e-icon>
              <div class="status-info">
                <div class="step-title">子账号信息</div>
                <div :class="`step-status status-${props.row.Enabled}`">
                  {{props.row.Enabled ? '已启用' : '已禁用'}}
                </div>
              </div>
            </div>
          </q-td>
          <q-td class="to-details-td">
            <div class="to-details table-cell">
              <div>></div>
            </div>
          </q-td>
        </q-tr>
      </template>

      <template v-slot:no-data>
        <div class="full-width full-height row flex-center q-gutter-sm">
          <span>暂 无 数 据</span>
        </div>
      </template>

      <template v-slot:bottom>
        <div
          v-if="pagination"
          class="full-width row flex-center"
        >
          共{{data.total}}条
          <q-pagination
            v-model="data.page"
            :max="data.pages"
            @input="paginationChanged"
            boundary-links
            boundary-numbers
            direction-links
            :max-pages="6"
          ></q-pagination>
        </div>
      </template>
    </q-table>
  </div>
</template>

<script>
import mixins from 'free-fe-mixins';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'SubAccountList',
  mixins: [mixins.ObjectDataMixin],
  // components: {
  //   SummaryHead,
  // },
  props: {
    pagination: { type: Boolean, default: true },
  },
  data() {
    return {
      queryFilter: {},
      showFilters: false,
      tablePagination: {
        rowsPerPage: this.data && this.data.limit ? this.data.limit : 8,
        rowsNumber: this.data && this.data.total ? this.data.total : 0,
      },
      columns: [
        {
          name: 'index',
          label: '#',
          field: 'index',
          align: 'center',
        },
        {
          name: 'date',
          label: '日期',
          field: 'LastUpdateDate',
          filters: 'normalDate',
          style: 'max-width: 200px;',
          align: 'center',
        },
        {
          name: 'name',
          label: '姓名',
          field: 'Profile.Name',
          style: 'max-width: 200px;',
          align: 'center',
        },
        {
          name: 'title',
          label: '职务',
          field: 'Profile.Title',
          style: 'max-width: 200px;',
          align: 'center',
        },
        {
          name: 'status',
          field: 'Enabled',
          style: 'max-width: 200px;',
          align: 'center',
        },
      ],
    };
  },
  computed: {
    valueFilters() {
      return (col, v) => {
        let val = v || col.value;
        if (col.filters) {
          let filters = [];
          if (typeof col.filters === 'string') {
            // only one filter
            filters.push(col.filters);
          } else if (Array.isArray(col.filters)) {
            filters = filters.concat(col.filters);
          }

          for (let i = 0; i < filters.length; i += 1) {
            const f = filters[i];
            const filter = this.ctx.filters[f];
            if (filter) {
              val = filter(v || col.value);
            }
          }
        }

        return val;
      };
    },
  },
  methods: {
    querySearch(query) {
      this.queryFilter = query;
      if (this.data.page > 1) {
        this.data.page = 1;
      } else {
        this.refreshData(query);
      }
    },
    rowClicked(e, r) {
      this.$router.push({
        path: `${this.$route.fullPath}/${r.id}`,
      });
    },
    paginationChanged(p) {
      this.refreshData({ page: p, ...this.queryFilter });
    },
  },
  beforeUnmount() { },
});
</script>
