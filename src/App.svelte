<script lang="ts">
import Body from './view/Body.svelte';

import Footer from './view/Footer.svelte';

export let appName: string;
export let logoPath: string;
export let schemaPath: string;
export let serverPath: string;
</script>

<style>
.root {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>

<div class="root">
  <Body {appName} {logoPath} {schemaPath} {serverPath} />

  <Footer />
</div>
