<script lang="ts">
export let appName: string;
export let logoPath: string;
</script>

<style>
.root {
  flex-grow: 0;
  flex-shrink: 0;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  flex-wrap: nowrap;
  padding: 3px 10px;
  border-bottom: 1px solid #eaeaea;
}

.logo {
  width: 40px;
  height: 40px;
}

span {
  font-size: 15px;
  font-family: 'Roboto', sans-serif;
  text-align: right;
}
</style>

<div class="root">
  <img src={logoPath} alt="Logo" class="logo" />
  <span>{appName}</span>
</div>
