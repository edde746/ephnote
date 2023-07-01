<script lang="ts">
  import { page } from '$app/stores';
  import type { ActionData, PageData } from './$types';
  import crypto from 'crypto-js';
  import MarkdownIt from 'markdown-it';
  const md = new MarkdownIt();

  export let data: PageData;
  export let form: ActionData;

  $: decrypted =
    data?.content && crypto.AES.decrypt(data.content, $page.url.hash.slice(1)).toString(crypto.enc.Utf8);
</script>

<svelte:head>
  <title>Read note - ephnote</title>
  <meta
    name="description"
    content="Someone sent you an end-to-end encrypted note with ephnote. Open the link to view the note."
  />
</svelte:head>

{#if data.destroyAfterRead && !$page.url.searchParams.has('read')}
  <p>
    The note will be destroyed after you read it.
    <a
      href="?read=true{$page.url.hash}"
      class="text-lime-700 dark:text-lime-500 hover:text-lime-600 underline">Click here to read it.</a
    >
  </p>
{:else if form?.decrypted || decrypted}
  <hr class="mb-4 mt-1 dark:border-neutral-500" />

  <div class="prose prose-neutral max-w-none dark:prose-invert prose-sm">
    {@html md.render(form?.decrypted || decrypted || '')}
  </div>
{:else}
  <noscript>
    <form action="?/decrypt" method="post">
      <input type="hidden" name="content" value={data.content} />
      <p class="mb-4">
        JavaScript is currently inactive. To access the content of the note, kindly decrypt it by pasting the
        current URL into the space provided below. Please be aware that this action will reveal the note's
        contents to the server.
      </p>
      <div class="flex flex-col md:flex-row flex-wrap md:flex-nowrap gap-2">
        <input type="text" class="input flex-1" name="url" placeholder="URL" />
        <button class="btn primary">Decrypt</button>
      </div>
    </form>
  </noscript>
{/if}
