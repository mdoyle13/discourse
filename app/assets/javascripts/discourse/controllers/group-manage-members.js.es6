import computed from 'ember-addons/ember-computed-decorators';
import { popupAjaxError } from 'discourse/lib/ajax-error';

export default Ember.Controller.extend({
  loading: false,
  setAsOwner: false,

  @computed('model.usernames', 'loading')
  disableAddButton(usernames, loading) {
    return loading || !usernames || !(usernames.length > 0);
  },

  actions: {
    addMembers() {
      this.set('loading', true);

      const model = this.get('model');
      const usernames = model.get('usernames');
      if (Em.isEmpty(usernames)) { return; }
      let promise;

      if (this.get('setAsOwner')) {
        promise = model.addOwners(usernames, true);
      } else {
        promise = model.addMembers(usernames, true);
      }

      promise.then(() => {
        this.transitionToRoute(
          "group.members",
          this.get('model.name'),
          { queryParams: { filter: usernames } }
        );
        model.set("usernames", null);
        this.send('closeModal');
      })
      .catch(popupAjaxError)
      .finally(() => this.set('loading', false));
    },
  },
});
