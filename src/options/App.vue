<template>
  <div>
    <section class="hero is-primary">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">
            Auto Proxy
          </h1>
          <h2 class="subtitle">
            Options
          </h2>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="container">
        <h1 class="title">Manage Proxies</h1>
        <h2 class="subtitle">
          Manage proxy configurations.
        </h2>
        <div class="field">
          <label class="label">Name</label>
          <div class="control">
            <input class="input"
                   type="text"
                   placeholder="Text input">
          </div>
        </div>

        <div class="field">
          <label class="label">Username</label>
          <div class="control has-icons-left has-icons-right">
            <input class="input is-success"
                   type="text"
                   placeholder="Text input"
                   value="bulma">
            <span class="icon is-small is-left">
              <i class="fas fa-user" />
            </span>
            <span class="icon is-small is-right">
              <i class="fas fa-check" />
            </span>
          </div>
          <p class="help is-success">This username is available</p>
        </div>

        <div class="field">
          <label class="label">Email</label>
          <div class="control has-icons-left has-icons-right">
            <input class="input is-danger"
                   type="email"
                   placeholder="Email input"
                   value="hello@">
            <span class="icon is-small is-left">
              <i class="fas fa-envelope" />
            </span>
            <span class="icon is-small is-right">
              <i class="fas fa-exclamation-triangle" />
            </span>
          </div>
          <p class="help is-danger">This email is invalid</p>
        </div>

        <div class="field">
          <label class="label">Subject</label>
          <div class="control">
            <div class="select">
              <select>
                <option>Select dropdown</option>
                <option>With options</option>
              </select>
            </div>
          </div>
        </div>

        <div class="field">
          <label class="label">Message</label>
          <div class="control">
            <textarea class="textarea"
                      placeholder="Textarea" />
          </div>
        </div>

        <div class="field">
          <div class="control">
            <label class="checkbox">
              <input type="checkbox"> I agree to the
              <a href="#">terms and conditions</a>
            </label>
          </div>
        </div>

        <div class="field">
          <div class="control">
            <label class="radio">
              <input type="radio"
                     name="question"> Yes
            </label>
            <label class="radio">
              <input type="radio"
                     name="question"> No
            </label>
          </div>
        </div>

        <div class="field is-grouped">
          <div class="control">
            <button class="button is-link">Submit</button>
          </div>
          <div class="control">
            <button class="button is-text">Cancel</button>
          </div>
        </div>
      </div>
    </section>
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
</style>
