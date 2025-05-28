<template>
  <div>
    <q-table v-model:pagination="pagination" :columns="columns" :visibleColumns="visibleColumns"
             :rows="AdvisoriesList" :separator="separator" :filter="filter" :filter-method="filterResults"
             flat bordered square @row-click="openErrata" style="border: #082336; color: #082336;" class="my-sticky-dynamic">

      <template v-slot:top-left>
          <div class="row" style="align-items: center;">
            <q-input borderless dense v-model="search" placeholder="Search" dark style="width: 10rem; padding-left: 20px;">
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
            </q-input>
            <q-select emit-value standout v-model="errataSource" :options="errataSourceOptions" label-color="green"
                      @update:model-value="updateErrataSource" label="Version" style="width: 9.5rem; margin-left: 12px;"/>
            <q-select standout v-model="severity" :options="severityOptions" label-color="yellow"
                      @update:model-value="updateErrataSource" label="Severity" style="width: 8rem; margin-left: 12px;"/>
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
// Label: Folder
  'All': null,
  'AlmaLinux 8': '8',
  'AlmaLinux 9': '9',
  'AlmaLinux 9': '10'
}

export default {
  name: "ErrataMainPage.vue",
  data () {
    return {
      ErrataData: [],
      search: '',
      separator: ref('cell'),
      pagination: ref({
        rowsPerPage: 15,
        page: 1
      }),
      columns: [
        {name: 'advisory', align: 'center', label: 'Advisory', field: 'advisory'},
        {name: 'summary', align: 'center', label: 'Summary', field: 'summary'},
        // This colum will only be shown when showing the erratas for all AlmaLinux versions
        {name: 'almalinux_version', align: 'center', label: 'AlmaLinux Version', field: 'almalinux_version'},
        {name: 'severity', align: 'center', label: 'Severity', field: 'severity'},
        {name: 'publish_date', align: 'center', label: 'Publish Date', field: 'publish_date'},
        // These two columns are never shown, they are only used to search by CVE number
        {name: 'description', field: 'description', classes: 'hidden', headerClasses: 'hidden'},
        {name: 'references', field: 'references', classes: 'hidden', headerClasses: 'hidden'}
      ],
      visibleColumns: ['advisory', 'summary', 'severity', 'publish_date', 'description'],
      errataSourceOptions: [],
      errataSource: ref('All'),
      severityOptions: ['All', 'Critical', 'Important', 'Moderate', 'Low'],
      severity: 'All'
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
    AdvisoriesList () {
      let rows = []
      for (let i in this.ErrataData) {
        rows.push({
          'advisory': this.ErrataData[i]['updateinfo_id'],
          'almalinux_version': this.ErrataData[i]['almalinux_version'],
          'summary': this.ErrataData[i]['summary'],
          'severity': this.ErrataData[i]['severity'],
          'publish_date': this.convertTimestamp(this.ErrataData[i]['updated_date']),
          'description': this.ErrataData[i]['description'],
          'references': this.ErrataData[i]['references']
        })
      }
      return rows.sort((first, second) => new Date(second['publish_date']) - new Date(first['publish_date']))
    },
    filter () {
      return {
        search: this.search.toLowerCase(),
        severity: this.severity
      }
    }
  },
  methods: {
    loadErrataData () {
      if (this.errataSource != 'All') {
        this.fetchErratasFromVersion(ERRATA_SOURCES[this.errataSource]).then((JsonData) => {
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
      // Go back to page 1 when reloading data
      this.pagination.page = 1
    },
    fetchErratasFromVersion (version) {
      return new Promise(resolve => {
        let resource = path.join(version, 'errata.json')
        axios.get(resource).then((result) => {
          let data = result.data
          // When showing all erratas, we need a way to know
          // the AlmaLinux version that an errata belongs to.
          // That's why we are adding such field into every errata.
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
        // We take all versions from ERRATA_SOURCES except 'All'
        const versions = Object.keys(ERRATA_SOURCES).filter(i=>i != 'All')
        for (let version in versions) {
          let promise = this.fetchErratasFromVersion(ERRATA_SOURCES[versions[version]]).then((JsonData) => {
            return JsonData
          })
          promises.push(promise)
        }
        Promise.all(promises).then((result) => {
          // Since every promise returns its own array, we need to put them all
          // together into a single one.
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
      // The references and description columns are never shown, but included to be able to search by CVE
      let noVersion = ['advisory', 'summary', 'severity', 'publish_date', 'description','references']
      this.visibleColumns = show? noVersion.concat('almalinux_version'): noVersion
    },
    filterResults (rows, filter, cols, cellValue) {
      let filteredResults = []
      // We assume that the user is searching by CVE when they enters 'cve'
      // At that point, no results will be returned back until a valid
      // CVE id is entered.
      const cveSearch = filter.search.match(/^cve/, 'i')
      filteredResults = cveSearch?
        this.cveSearch(rows, filter.search, cols, cellValue) :
        this.defaultSearch(rows, filter.search, cols, cellValue)
      // Apply severity filter.
      if (this.severity !== 'All') {
        filteredResults = filteredResults.filter(row => row.severity == this.severity)
      }
      return filteredResults;
    },
    defaultSearch (rows, search, cols, cellValue) {
      // Default filter method taken from Quasar and slightly updated to
      // fit our needs, see:
      // https://github.com/quasarframework/quasar/blob/dev/ui/src/components/table/table-filter.js#L8
      var searchCols = cols.filter(col => {
        return (col.name != 'references')? col: null
      })
      return rows.filter(
        row => searchCols.some(col => {
          const val = cellValue(col, row) + ''
          const haystack = (val === 'undefined' || val === 'null') ? '' : val.toLowerCase()
          return haystack.indexOf(search) !== -1
        })
      )
    },
    cveSearch (rows, search, cols, cellValue) {
      let filteredResults = []
      // We need to ensure that we do not return anything until
      // a complete CVE id is provided
      if (!search.match(/^cve-\d{4}-\d{4,7}$/, 'i')) return filteredResults
      // We only search for CVE ids in the 'description' and 'references' columns
      var searchCols = cols.filter(col => {
        return (col.name == 'description' || col.name == 'references')? col: null
      })
      filteredResults = rows.filter(
        row => searchCols.some(col => {
          let val = cellValue(col, row)
          // description is a string and references is an object
          val = typeof(val) === 'string' ?
            val:
            JSON.stringify(val)
          // We search for CVE id and we make sure that it is not
          // followed by a digit
          const regex = new RegExp(search + '[^0-9]', 'i')
          return val.match(regex)
        })
      )
      return filteredResults
    }
  }
}
</script>

<style lang="css">
  .errata_table {
    background-color: #082336;
    color: white;
    font-family: 'Montserrat', sans-serif;
  }
  .q-table {
    font-family: 'Montserrat', sans-serif;
  }
  .my-sticky-dynamic {
    /* height or max-height is important */
    max-height: calc(100vh - 52px); /* - logo bar height */
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
    .my-sticky-dynamic .q-table__middle {
      scrollbar-width: thin;
    }
</style>
