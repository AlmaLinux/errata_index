<template>
  <div>
    <q-table :columns="columns" :visibleColumns="visibleColumns" :rows="AdvirosiesList" :separator="separator" :filter="filter"
             flat bordered square :pagination="initialPagination" @row-click="openErrata"
             style="border: #082336; color: #082336;" class="my-sticky-dynamic">

      <template v-slot:top-left>
          <div class="row">
            <div class="col">
              <q-input borderless dense v-model="filter" placeholder="Search" dark style="padding-left: 20px;">
                <template v-slot:prepend>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>
            <div class="col">
              <q-btn-toggle dark v-model="errataSource" :options="errataSourceOptions" @update:model-value="updateErrataSource"/>
            </div>
          </div>
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
import { ref } from 'vue'
import axios from 'axios'
import path from 'path'
const ERRATA_SOURCES = {
  'All': null,
  'AlmaLinux 8': '8',
  'AlmaLinux 9': '9'
}

export default {
  name: "ErrataMainPage.vue",
  data () {
    return {
      ErrataData: [],
      filter: ref(''),
      separator: ref('cell'),
      initialPagination: ref({rowsPerPage: 15}),
      columns: [
        {name: 'advisory', align: 'center', label: 'Advisory', field: 'advisory'},
        {name: 'description', align: 'center', label: 'Description', field: 'description'},
        {name: 'almalinux_version', align: 'center', label: 'AlmaLinux Version', field: 'almalinux_version'},
        {name: 'severity', align: 'center', label: 'Severity', field: 'severity'},
        {name: 'publish_date', align: 'center', label: 'Publish Date', field: 'publish_date'}
      ],
      visibleColumns: ['advisory', 'description', 'severity', 'publish_date'],
      errataSourceOptions: [],
      errataSource: ref('All')
    }
  },
  created () {
    Object.keys(ERRATA_SOURCES).forEach((source) => {
      this.errataSourceOptions.push({
        label: source,
        value: source
      })
    })
    this.loadErrataData();
  },
  computed: {
    AdvirosiesList () {
      let rows = []
      for (let i in this.ErrataData) {
        rows.push({
          'advisory': this.ErrataData[i]['updateinfo_id'],
          'almalinux_version': this.ErrataData[i]['almalinux_version'],
          'description': this.ErrataData[i]['summary'],
          'severity': this.ErrataData[i]['severity'],
          'publish_date': this.convertTimestamp(this.ErrataData[i]['updated_date'])
        })
      }
      return rows.sort((first, second) => new Date(second['publish_date']) - new Date(first['publish_date']))
    }
  },
  methods: {
    loadErrataData () {
      if (this.errataSource != 'All') {
        this.fetchErratasByAlmaLinuxVersion(ERRATA_SOURCES[this.errataSource]).then((JsonData) => {
          this.ErrataData = JsonData
          this.showVersionColumn(false)
        })
      } else {
        this.fetchAllErratas().then((JsonData) => {
          this.ErrataData = JsonData
          this.showVersionColumn(true)
        })
      }
    },
    openErrata (evt, row) {
      window.location.href = this.makeValidHref(row['almalinux_version'], row['advisory'])
    },
    convertTimestamp (timestamp) {
      let date = new Date(timestamp['$date'])
      return date.toDateString()
    },
    makeValidHref (version, advisory) {
      return `/${version}/${advisory.replace(/:/g, "-")}.html`
    },
    updateErrataSource () {
      this.loadErrataData()
    },
    fetchErratasByAlmaLinuxVersion (version) {
      return new Promise(resolve => {
        let resource = path.join(version, 'errata.json')
        axios.get(resource).then((result) => {
          let data = result.data
          for (let errata in data) {
            data[errata]['almalinux_version'] = version
          }
          resolve(result.data)
        });
      })
    },
    fetchAllErratas () {
      return new Promise(resolve => {
        let promises = [];
        const dists = Object.keys(ERRATA_SOURCES).filter(i=>i != 'All')
        for (let dist in dists) {
          let promise = this.fetchErratasByAlmaLinuxVersion(ERRATA_SOURCES[dists[dist]]).then((JsonData) => {
            return JsonData
          })
          promises.push(promise)
        }
        Promise.all(promises).then((result) => {
          // Since every promise returns its own array, we need to put them all
          // together into one array.
          let data = []
          result.forEach((p) => {
            p.forEach((d) => {
              data.push(d)
            })
          })
          resolve(data)
        })
      })
    },
    showVersionColumn (show) {
      let noVersion = ['advisory', 'description', 'severity', 'publish_date']
      this.visibleColumns = show? noVersion.concat('almalinux_version'): noVersion
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
