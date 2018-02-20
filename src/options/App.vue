<template>
  <div class="section">
    <nav class="panel">
      <p class="panel-heading">
        Proxies
      </p>
      <span class="panel-block is-active">
        Direct Connection
      </span>
      <span class="panel-block">
        <span class="is-pulled-left">marksheet</span>
        <a class="button is-small is-danger is-pulled-right">x</a>
      </span>
    </nav>
    <div class="field has-addons">
      <p class="control">
        <span class="select">
          <select>
            <option>HTTP</option>
            <option>HTTPS</option>
            <option>SOCKS4</option>
            <option>SOCKS5</option>
          </select>
        </span>
      </p>
      <p class="control is-expanded">
        <input class="input"
               type="text"
               placeholder="Address:Port">
      </p>
      <p class="control">
        <a class="button is-primary">Add</a>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      msg: 'Welcome!'
    }
  }
}
</script>

<style lang="stylus">
.section {
  padding: 2rem 1rem
}
</style>
