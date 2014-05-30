###EmberStrap.DatePicker = Ember.Component.extend
  template: Ember.Handlebars.compile('<div class="dropdown-menu datepicker" style="max-width: 320px;">
    <table style="table-layout: fixed; height: 100%; width: 100%;">
      <thead>
        <tr class="text-center">
          <th>
            <button tabindex="-1" type="button" class="btn btn-default pull-left">
              <span class="caret caret-left"></span>
            </button>
          </th>

          <th colspan="{{ view.columns.length - 2 }}">
            <button tabindex="-1" type="button" class="btn btn-default btn-block text-strong">
              <strong style="text-transform: capitalize;">{{view.title}}</strong>
            </button>
          </th>
          <th>
            <button tabindex="-1" type="button" class="btn btn-default pull-right">
              <span class="caret caret-right"></span>
            </button>
          </th>
        </tr>
        <tr></tr>
      </thead>
      <tbody>
        {{#each view.rows}}
        <tr height="{{ 100 / rows.length }}%">
          <td class="text-center">
            <button tabindex="-1" type="button" class="btn btn-default" style="width: 100%">
              <span class="text-muted">{{label}}</span>
            </button>
          </td>
        </tr>
        {{/each}}
  </tbody>
</table>
</div>')###
