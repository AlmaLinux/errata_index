<template>
  <div>
    <q-layout view="hHh lpr fff" style="max-height: calc(100vh - 52px); min-height: calc(100vh - 52px);">
      <q-header style="height: 52px; background-color: #082336;">
        <q-toolbar>
          <q-toolbar-title>
            <img class="header-logo" src="./assets/misc/static/almalinux-logo.png" alt="AlmaLinux">
          </q-toolbar-title>
        </q-toolbar>
      </q-header>
      <q-page-container style="padding-top: initial;">
        <ErrataMainPage />
      </q-page-container>
    </q-layout>
  </div>
</template>

<script>
import ErrataMainPage from './components/ErrataMainPage.vue'
import { setCssVar } from 'quasar'
setCssVar('primary', '#082336')
export default {
  name: 'App',
  components: {
    ErrataMainPage
  }
}
</script>

<style lang="css">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 52px;
}
.header-logo {
  float: left;
  margin-left: 20px;
  padding-top: 5px;
	width: 160px;
}
</style>
