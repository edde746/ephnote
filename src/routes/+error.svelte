<script lang="ts">
  import { page } from '$app/stores';
</script>

<svelte:head>
  <title>Error {$page.status} - ephnote</title>
</svelte:head>

<h1 class="text-2xl font-black">{$page.status}</h1>
<p>{$page.error?.message || 'Unknow error'}</p>
