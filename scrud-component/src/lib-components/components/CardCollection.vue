
<script>
export default {
  name: 'CardCollection',
  render (h) {
    return this.getCards()
  },
  methods: {
    getCards() {
      let cards = this.$slots.default
      let elems = []

      if (cards) {
        cards.forEach(card => {
          elems.push(
            <div class="col-auto mb-3">
              { card }
            </div>
          )
        })
      }


      return (
        <div class="container mt-3">
          <div class="row">
            { elems }
          </div>
        </div>
      )
    }
  }
}
</script>

<style>
</style>