<script lang="ts">
export let text: string;
</script>

<style>
.root {
  display: flex;
  flex-direction: column;
  padding: 8px;
}

span {
  font-size: 15px;
  font-family: monospace;
  white-space: pre-wrap;
}
</style>

<div class="root">
  <span>{text || ''}</span>
</div>
