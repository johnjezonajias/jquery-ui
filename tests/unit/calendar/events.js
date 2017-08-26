define( [
	"qunit",
	"jquery",
	"./helper",
	"ui/widgets/calendar"
], function( QUnit, $, testHelper ) {

QUnit.module( "calendar: events", {
	beforeEach: function() {
		this.element = $( "#calendar" ).calendar();
	}
} );

QUnit.test( "change", function( assert ) {
	assert.expect( 8 );

	var shouldFire, eventType;

	this.element.calendar( {
		change: function( event, ui ) {
			assert.ok( shouldFire, "change event fired" );
			assert.equal(
				event.type,
				"calendarchange",
				"change event"
			);
			assert.equal(
				event.originalEvent.type,
				eventType,
				"change originalEvent on calendar button " + eventType
			);
			assert.equal( $.type( ui.value ), "date", "value is a date object" );
		}
	} );

	shouldFire = true;
	eventType = "mousedown";
	this.element.find( "tbody button" ).last().simulate( eventType );

	shouldFire = true;
	eventType = "keydown";
	testHelper.focusGrid( this.element )
		.simulate( eventType, { keyCode: $.ui.keyCode.HOME } )
		.simulate( eventType, { keyCode: $.ui.keyCode.ENTER } );

	shouldFire = false;
	eventType = "mousedown";
	this.element.find( "tbody button" ).first().simulate( eventType );
} );

QUnit.test( "select", function( assert ) {
	assert.expect( 8 );

	var ready = assert.async(),
		that = this,
		message, eventType;

	this.element.calendar( {
		select: function( event, ui ) {
			assert.ok( true, "select event fired " + message );
			assert.equal(
				event.type,
				"calendarselect",
				"select event " + message
			);
			assert.equal(
				event.originalEvent.type,
				eventType,
				"select originalEvent " + message
			);
			assert.equal( $.type( ui.value ), "date", "value is a date object" );
		}
	} );

	function step1() {
		eventType = "mousedown";
		message = "on calendar button " + eventType;
		that.element.find( "table button:eq(1)" ).simulate( eventType );
		setTimeout( step2, 50 );
	}

	function step2() {
		eventType = "keydown";
		message = "on calendar button " + eventType;
		testHelper.focusGrid( that.element )
			.simulate( eventType, { keyCode: $.ui.keyCode.END } )
			.simulate( eventType, { keyCode: $.ui.keyCode.ENTER } );
		setTimeout( step3, 50 );
	}

	// This should not trigger another event
	function step3() {
		that.element.calendar( "disable" );
		that.element.find( "table button:eq(10)" ).simulate( "mousedown" );
		setTimeout( ready, 50 );
	}

	step1();
} );

QUnit.test( "refresh", function( assert ) {
	assert.expect( 2 );

	var shouldFire;

	this.element.calendar( {
		refresh: function() {
			assert.ok( shouldFire, "refresh event fired" );
		}
	} );

	shouldFire = true;
	this.element.find( "button.ui-calendar-next" ).simulate( "click" );

	shouldFire = false;
	this.element.find( "table button:eq(1)" ).simulate( "click" );

	testHelper.focusGrid( this.element ).simulate( "keydown", { keyCode: $.ui.keyCode.END } );
	shouldFire = true;
	testHelper.focusGrid( this.element ).simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
} );

} );