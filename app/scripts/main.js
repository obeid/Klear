    var Task = Backbone.Model.extend ({
    defaults: function () {
      return {
        item: ''
      };
    },

    idAttribute: '_id',
    urlRoot: 'http://tiny-pizza-server.herokuapp.com/collections/taters'
    });

    var Tasks = Backbone.Collection.extend ({
    model: Task,
    localStorage: new Store('Session'),
    urlRoot: 'http://tiny-pizza-server.herokuapp.com/collections/taters'

    });

    var todo = new Tasks();

    var TaskView = Backbone.View.extend ({
    model: new Task(),

    initialize: function() {
      this.template = Handlebars.compile($('#itemTemplate').html());
      this.$el.append(rendered);
    },

    delete: function(ev) {
    	ev.preventDefault();
    	todo.remove(this.model);
    },
    render: function() {
    	this.$el.html(this.template(this.model.toJSON()));
    	return this;
    }

    });


    var TasksView = Backbone.View.extend({
    model: todo,
    el: $('#itemTemplate'),
    initialize: function() {
      // console.log('TasksView has been initiated');
    	this.model.on('add', this.render, this);
    	this.model.on('remove', this.render, this);
      this.listenTo(this.collection, 'reset', this.render);
      this.collection.fetch();
    },
    render: function() {
    	var self = this;
      var template = Handlebars.compile($("#itemTemplate").html());
      var rendered = template({todo: this.collection.toJSON()});
      $('#listTemplate').html(rendered);
      return this;
    }
    });

    $(document).ready(function() {
  		$('#new-Task').submit(function(ev) {
  			var task = new Task({ item: $('#task-content').val() });
  			todo.add(task);
         //todo.save();
  			console.log(todo.toJSON());

  			return false;
  		});

      // var appView = new TasksView();

  	});

    new TasksView({
      collection: todo,
        events: {
          'keypress #new-Task': 'createOnEnter',
          },
        createOnEnter: function (e) {
        if (e.which === ENTER_KEY && this.$input.val().trim()) {
          app.todos.create(this.newAttributes());
          this.$input.val('');
        }
    }
    });
