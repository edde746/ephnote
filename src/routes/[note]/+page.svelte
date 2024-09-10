<script lang="ts">
  import { page } from '$app/stores';
  import { decryptNote } from '$lib';
  import type { ActionData, PageData } from './$types';
  import MarkdownIt from 'markdown-it';
  import { browser } from '$app/environment';
  const md = new MarkdownIt();

  export let data: PageData;
  export let form: ActionData;
</script>

<svelte:head>
  <title>Read note - ephnote</title>
  <meta
    name="description"
    content="Someone sent you an end-to-end encrypted note with ephnote. Open the link to view the note."
  />
</svelte:head>

{#if data.destroyAfterRead && !$page.url.searchParams.has('read') && browser}
  <p>
    The note will be destroyed after you read it.
    <a
      data-sveltekit-preload-data="false"
      href="?read=true{$page.url.hash}"
      class="text-lime-700 dark:text-lime-500 hover:text-lime-600 underline"
    >
      Click here to read it.
    </a>
  </p>
{:else if form?.decrypted || (data.content && $page.url.hash)}
  <hr class="mb-4 mt-1 dark:border-neutral-500" />

  <div class="prose prose-neutral max-w-none dark:prose-invert">
    {#if form?.decrypted}
      {@html md.render(form.decrypted)}
    {:else if data.content}
      {#await decryptNote(data.content, $page.url.hash) then content}
        {@html md.render(content)}
      {/await}
    {/if}
  </div>
{:else}
  <noscript>
    <form action="?/decrypt" method="post">
      <p class="mb-4">
        JavaScript is currently inactive. To access the content of the note, paste the current URL into the
        input below. Please be aware that this action will reveal the note's contents to the server.

        {#if data.destroyAfterRead}
          The note will be destroyed after you read it.
        {/if}
      </p>

      <div class="flex flex-col md:flex-row flex-wrap md:flex-nowrap gap-2">
        <input type="text" class="input flex-1" name="url" placeholder="URL" />
        <button class="btn primary">Decrypt</button>
      </div>
    </form>
  </noscript>
{/if}
