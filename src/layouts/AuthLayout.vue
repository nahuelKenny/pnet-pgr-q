<template>
  <q-layout view="hHh lpR fFf" class="bgLoginLayout">
    <!--
    <q-header>
      <q-toolbar class="bg-white text-primary">
        <q-toolbar-title>
          <q-img
            :src="logoPnet"
            width="160px"
            style="cursor: pointer"
            @click="router.push({ path: '/inicio' })"
            v-ripple
            alt="Logo"
          />
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    -->
    <q-page-container>
      <router-view />
    </q-page-container>+

  </q-layout>
</template>

<script setup>
//import logoPnet from "assets/logo-pnet.png"
</script>

<style>

.bgLoginLayout, body {
    background: #23B3BC;
    background: linear-gradient(90deg,rgba(35, 179, 188, 1) 0%, rgba(61, 103, 136, 1) 100%);
}
</style>