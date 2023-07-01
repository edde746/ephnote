<script lang="ts">
  import { Icon } from '@steeze-ui/svelte-icon';
  import { Github, Clipboard, Check } from '@steeze-ui/lucide-icons';
  import { applyAction, enhance } from '$app/forms';
  import type { ActionData } from './$types';
  import crypto from 'crypto-js';
  import Base64 from 'crypto-js/enc-base64';
  import { page } from '$app/stores';

  let encryptionKey = '';
  let justCopied = false;

  export let form: ActionData;
</script>

<div class="contain">
  <div class="flex justify-between items-center mb-4">
    <div>
      <h1 class="text-2xl font-black">ephnote</h1>
      <span class="text-xs text-neutral-800 dark:text-neutral-400">- e2ee note sharing</span>
    </div>
    <div class="flex gap-2 items-center">
      <a
        href="https://github.com/edde746/ephnote"
        class="p-2 rounded-full dark:hover:bg-neutral-900 hover:bg-neutral-100"
      >
        <Icon src={Github} class="w-6 h-6" />
        <span class="sr-only">GitHub</span>
      </a>
    </div>
  </div>
  {#if form?.id}
    {@const url = `${$page.url.origin}/${form.id}#${form.key || encryptionKey}`}
    <p class="mb-2">Your note has been created. Share the link below with the recipient.</p>

    <div class="flex mb-2">
      <input
        type="text"
        value={url}
        readonly
        class="w-full dark:text-neutral-400 text-neutral-700 bg-transparent focus:outline-none border border-r-0 border-colors px-3 py-2 rounded-lg rounded-r-none"
      />
      <button
        type="button"
        on:click={() => {
          navigator.clipboard.writeText(url);
          justCopied = true;
          setTimeout(() => (justCopied = false), 2000);
        }}
        class="btn border w-max border-lime-700 dark:border-lime-600 dark:bg-lime-700 bg-lime-500 hover:brightness-105 rounded-lg rounded-l-none"
      >
        <Icon src={justCopied ? Check : Clipboard} class="w-6 h-6" />
      </button>
    </div>

    <a class="btn primary w-full block text-center" href="/"> Create Another </a>
  {:else}
    <form
      method="post"
      use:enhance={({ formData }) => {
        const content = formData.get('content');
        if (!content || content.length === 0 || typeof content !== 'string') return;

        encryptionKey = Base64.stringify(crypto.lib.WordArray.random(32));
        const encrypted = crypto.AES.encrypt(content, encryptionKey).toString();
        formData.set('content', encrypted);
        formData.set('encrypted', 'true');

        return ({ result }) => {
          applyAction(result);
        };
      }}
    >
      <noscript>
        <span class="text-xs text-yellow-500 mb-4 block">
          You can still share this note, but it will be encrypted on the server instead of in your browser.
        </span>
      </noscript>
      <textarea
        data-testid="content"
        name="content"
        rows="10"
        class="w-full input mb-2"
        placeholder="Write your message here..."
        maxlength={1024 * 16}
      />
      <div class="flex flex-wrap md:justify-between items-center gap-2">
        <label>
          Destroy after
          <select name="destroy" class="input sm">
            <option value={1}>1 day</option>
            <option value={3}>3 days</option>
            <option value={7}>7 days</option>
            <option value={30}>30 days</option>
          </select>
        </label>

        <label>
          or after reading
          <input type="checkbox" name="read" class="input" checked />
        </label>

        <button
          type="submit"
          class="btn primary ml-auto block whitespace-nowrap flex-nowrap flex-1 md:flex-none"
        >
          Share Note
        </button>
      </div>
    </form>
  {/if}
</div>

<style>
  label {
    @apply flex items-center gap-2 text-sm;
  }
</style>
