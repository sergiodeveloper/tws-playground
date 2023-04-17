<script lang="ts">
export let text: string | undefined = undefined;
</script>

<style>
.root {
  display: inline-block;
  position: relative;
  width: 16px;
  height: 16px;
  overflow: visible;
  border-radius: 50%;
  vertical-align: middle;
}

.icon {
  user-select: none;
  vertical-align: middle;
  border-radius: 50%;
  background-color: #ccc;
  color: #fff;
  font-size: 13px;
  font-weight: bold;
  line-height: 16px;
  text-align: center;
  cursor: help;
  font-family: monospace;
}

.icon:hover {
  background-color: #aaa;
}

.text-container {
  display: none;
  position: absolute;
  top: 0;
  left: 100%;
  width: 400px;
  margin-left: -100%;
  margin-top: 120%;
  z-index: 1;
}

.text {
  display: inline-block;
  padding: 5px;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 13px;
  font-family: 'Roboto', sans-serif;
  word-break: break-word;
  max-width: 100%;
  box-sizing: border-box;
}

.root:hover .text-container {
  display: block;
}
</style>

<div class="root">
  <div class="icon">i</div>
  <div class="text-container">
    <div class="text">{text}</div>
  </div>
</div>
