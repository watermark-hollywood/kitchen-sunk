(function( $ ) {

	'use strict';

	var EditableTable = {

		options: {
			addButton: '#addToTable',
			table: '#datatable-editable',
			select: true,
			dialog: {
				wrapper: '#dialog',
				cancelButton: '#dialogCancel',
				confirmButton: '#dialogConfirm',
			}
		},

		initialize: function() {
			this
				.setVars()
				.build()
				.events();
		},

		setVars: function() {
			this.$table				= $( this.options.table );
			this.$addButton			= $( this.options.addButton );

			// dialog
			this.dialog				= {};
			this.dialog.$wrapper	= $( this.options.dialog.wrapper );
			this.dialog.$cancel		= $( this.options.dialog.cancelButton );
			this.dialog.$confirm	= $( this.options.dialog.confirmButton );

			return this;
		},

		build: function() {
			this.datatable = this.$table.DataTable({ajax: {"url":"guestcount","dataSrc":""},
                "columns": [
                    {"data": "title"},
                    {"data": "thursday"},
                    {"data": "friday"},
                    {"data": "saturday"},
                    {"data": "sunday"},
                    {"data": "monday"},
                    {"data": "tuesday"},
                    {"data": "wednesday"},
					{"data": null, "defaultContent": "<a href=\"#\" class=\"hidden on-editing save-row\"><i class=\"fa fa-save\"></i></a>" +
            	"<a href=\"#\" class=\"hidden on-editing cancel-row\"><i class=\"fa fa-times\"></i></a>" +
                "<a href=\"#\" class=\"on-default edit-row\"><i class=\"fa fa-pencil\"></i></a>" +
                "<a href=\"#\" class=\"on-default remove-row\"><i class=\"fa fa-trash-o\"></i></a>", className: "actions"},
					{"data": "startOfWeek", "className": "hidden"}
                ],
				"ordering": false,
                "drawCallback" : function(settings) {
					$('#datatable-editable').children('tbody').children('tr:first').children('.actions').addClass('hidden');
				}
			});
			window.dt = this.datatable;

			return this;
		},

		events: function() {
			var _self = this;

			this.$table
				.on('click', 'a.save-row', function( e ) {
					e.preventDefault();

					_self.rowSave( $(this).closest( 'tr' ) );
				})
				.on('click', 'a.cancel-row', function( e ) {
					e.preventDefault();

					_self.rowCancel( $(this).closest( 'tr' ) );
				})
				.on('click', 'a.edit-row', function( e ) {
					e.preventDefault();

					_self.rowEdit( $(this).closest( 'tr' ) );
				})
				.on( 'click', 'a.remove-row', function( e ) {
					e.preventDefault();

					var $row = $(this).closest( 'tr' );

					$.magnificPopup.open({
						items: {
							src: _self.options.dialog.wrapper,
							type: 'inline'
						},
						preloader: false,
						modal: true,
						callbacks: {
							change: function() {
								_self.dialog.$confirm.on( 'click', function( e ) {
									e.preventDefault();

									_self.rowRemove( $row );
									$.magnificPopup.close();
								});
							},
							close: function() {
								_self.dialog.$confirm.off( 'click' );
							}
						}
					});
				});

			this.$addButton.on( 'click', function(e) {
				e.preventDefault();

				_self.rowAdd();
			});

			this.dialog.$cancel.on( 'click', function( e ) {
				e.preventDefault();
				$.magnificPopup.close();
			});

			return this;
		},

		// ==========================================================================================
		// ROW FUNCTIONS
		// ==========================================================================================
		rowAdd: function() {
			this.$addButton.attr({ 'disabled': 'disabled' });

			var actions,
				data,
				$row;

			actions = [
				'<a href="#" class="hidden on-editing save-row"><i class="fa fa-save"></i></a>',
				'<a href="#" class="hidden on-editing cancel-row"><i class="fa fa-times"></i></a>',
				'<a href="#" class="on-default edit-row"><i class="fa fa-pencil"></i></a>',
				'<a href="#" class="on-default remove-row"><i class="fa fa-trash-o"></i></a>'
			].join(' ');

			data = this.datatable.row.add([ '', '', '', actions ]);
			$row = this.datatable.row( data[0] ).nodes().to$();

			$row
				.addClass( 'adding' )
				.find( 'td:last' )
				.addClass( 'actions' );

			this.rowEdit( $row );

			this.datatable.order([0,'asc']).draw(); // always show fields
		},

		rowCancel: function( $row ) {
			var _self = this,
				$actions,
				i,
				data;

			if ( $row.hasClass('adding') ) {
				this.rowRemove( $row );
			} else {

				data = this.datatable.row( $row.get(0) ).data();
				this.datatable.row( $row.get(0) ).data( data );

				$actions = $row.find('td.actions');
				if ( $actions.get(0) ) {
					this.rowSetActionsDefault( $row );
				}

				this.datatable.draw();
			}
		},

		rowEdit: function( $row ) {
			var _self = this,
				data;
            var dayNames = ["thursday", "friday", "saturday", "sunday", "monday", "tuesday", "wednesday"];

			data = this.datatable.row( $row.get(0) ).data();

			$row.children( 'td' ).each(function( i ) {
				var $this = $( this );

				if ( $this.hasClass('actions') ) {
					_self.rowSetActionsEditing( $row );
				} else {
					if (i > 0 && i < 8) {
                        $this.html('<input type="text" class="form-control input-block" value="' + data[dayNames[i - 1]] + '"/>');
                    }
				}
			});
		},

		rowSave: function( $row ) {
			var _self     = this,
				$actions,
				values    = [];

			if ( $row.hasClass( 'adding' ) ) {
				this.$addButton.removeAttr( 'disabled' );
				$row.removeClass( 'adding' );
			}

			values = $row.find('td').map(function(index) {
                var dayNames = ["title", "thursday", "friday", "saturday", "sunday", "monday", "tuesday", "wednesday","","startOfWeek"];
				var $this = $(this);

				if ( $this.hasClass('actions') ) {
					_self.rowSetActionsDefault( $row );
					return _self.datatable.cell( this ).data();
				} else {
					var name = dayNames[index];
					var rvalue;
					if (index == 0 || index == 9) {
						rvalue = $this.html();
					} else {
                        rvalue = $.trim($this.find('input').val());
                    }
                    var retObject = new Object;
                    retObject[name] = rvalue;
					return retObject;
				}
			});

			var value = new Object;
			for (var i = 0; i < 10; i++) {
				if (i != 8) {
                    value[Object.keys(values[i])] = values[i][Object.keys(values[i])];
                }
			}
            $.ajax({
				context: this,
                type:"POST",
                url: this.datatable.ajax.url(),
                data: JSON.stringify(value),
                complete: function () {
                    this.datatable.ajax.reload();
                }
            });
		},

		rowRemove: function( $row ) {
			if ( $row.hasClass('adding') ) {
				this.$addButton.removeAttr( 'disabled' );
			}

			this.datatable.row( $row.get(0) ).remove().draw();
		},

		rowSetActionsEditing: function( $row ) {
			$row.find( '.on-editing' ).removeClass( 'hidden' );
			$row.find( '.on-default' ).addClass( 'hidden' );
		},

		rowSetActionsDefault: function( $row ) {
			$row.find( '.on-editing' ).addClass( 'hidden' );
			$row.find( '.on-default' ).removeClass( 'hidden' );
		}

	};

	$(function() {
		EditableTable.initialize();
	});

}).apply( this, [ jQuery ]);