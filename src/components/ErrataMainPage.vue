<template>
  <div>
    <q-table :columns="columns" :rows="AdvirosiesList" :separator="separator" :filter="filter"
             flat bordered square :pagination="initialPagination" @row-click="openErrata"
             style="border: #082336; color: #082336;" class="my-sticky-dynamic">
      <template v-slot:top-left>
        <q-input borderless dense v-model="filter" placeholder="Search" dark style="padding-left: 20px;">
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
      <template v-slot:header="props">
        <q-tr :props="props" class="errata_table">
           <q-th v-for="col in props.cols" :key="col.name" :props="props">
             {{ col.label }}
           </q-th>
         </q-tr>
      </template>
      <template v-slot:body-cell="props">
        <q-td :props="props">
          {{ props.value }}
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script>
import ErrataData from '../assets/errata.json'
import { ref } from 'vue'
export default {
  name: "ErrataMainPage.vue",
  data () {
    return {
      filter: ref(''),
      separator: ref('cell'),
      initialPagination: ref({rowsPerPage: 15}),
      columns: [
        {name: 'advisory', align: 'center', label: 'Advisory', field: 'advisory'},
        {name: 'description', align: 'center', label: 'Description', field: 'description'},
        {name: 'severity', align: 'center', label: 'Severity', field: 'severity'},
        {name: 'publish_date', align: 'center', label: 'Publish Date', field: 'publish_date'}
      ]
    }
  },
  computed: {
    AdvirosiesList () {
      let rows = []
      for (let i in ErrataData) {
        rows.push({
          'advisory': ErrataData[i]['updateinfo_id'],
          'description': ErrataData[i]['summary'],
          'severity': ErrataData[i]['severity'],
          'publish_date': this.convertTimestamp(ErrataData[i]['updated_date'])
        })
      }
      return rows.sort((first, second) => new Date(second['publish_date']) - new Date(first['publish_date']))
    }
  },
  methods: {
    openErrata (evt, row) {
      window.location.href = this.makeValidHref(row['advisory'])
    },
    convertTimestamp (timestamp) {
      let date = new Date(timestamp['$date'])
      return date.toDateString()
      // return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`
    },
    makeValidHref (advisory) {
      return `static/html/${advisory.replace(/:/g, "-")}.html`
    }
  }
}
</script>

<style lang="css">
  .errata_table {
    background-color: #082336;
    color: white;
  }
  .my-sticky-dynamic {
    /* height or max-height is important */
    height: 921px;
    /* this will be the loading indicator */ }
    .my-sticky-dynamic .q-table th {
      font-size: 12.5pt;
      font-weight: bold;
      letter-spacing: 0.035em;
      position: sticky;
      text-align: center;
    }
    .my-sticky-dynamic .q-table tbody td {
      font-size: 11pt;
      letter-spacing: 0.02em;
      color: #082336;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: break-spaces;
      width: fit-content;
      min-width: 200px;
      max-width: 50%;
    }
    .my-sticky-dynamic .q-table__top,
    .my-sticky-dynamic .q-table__bottom,
    .my-sticky-dynamic thead tr:first-child th {
      background-color: #082336;
      color: white;
    }
    .my-sticky-dynamic thead tr th {
      position: sticky;
      z-index: 1; }
    .my-sticky-dynamic thead tr:last-child th {
      /* height of all previous header rows */
      top: 48px; }
    .my-sticky-dynamic thead tr:first-child th {
      top: 0; }
    .my-sticky-dynamic .q-field__native, .q-field__prefix, .q-field__suffix, .q-field__input {
      color: white;
    }
    .my-sticky-dynamic .text-grey-8 {
      color: white;
    }
</style>