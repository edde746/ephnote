<script lang="ts">
  import { Icon } from '@steeze-ui/svelte-icon';
  import { Github } from '@steeze-ui/lucide-icons';
</script>

<form class="contain" method="post" action="?/share">
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
  />
  <div class="flex justify-between items-center gap-2">
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

    <button type="submit" class="btn primary ml-auto block whitespace-nowrap flex-nowrap">Share Note</button>
  </div>
</form>

<style>
  label {
    @apply flex items-center gap-2 text-sm;
  }
</style>
