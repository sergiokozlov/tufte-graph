// I borrowed liberally from flot - it's good at other types of graphs
(function($) {
  $.tufteBar = function( target, data ) {
    var plot = new TufteBar( target, data );
    return plot;
  }

  $.tufteBar.defaults = {
    barWidth: 0.8,
    color:     function(element, index) { return '#476fb2'; },
    barLabel:  function(element, index) { return element[0]; },
    axisLabel: function(element, index) { return index; }
  }

  function TufteBar( target_, options_ ) {
    var target = target_;
    var options = $.extend(true, $.tufteBar.defaults, options_);

    var axis = makeAxis(options);
    var plot = makePlot(plot);

    draw(target, plot, options);

    function draw(target, plot, options) {
      var ctx = plot.ctx;

      for (var i = 0; i < options.data.length; ++i) {
        element = options.data[i];

        var x = i + 0.5,
            y = element[0];

        var halfBar = options.barWidth / 2;
        var left   = x - halfBar,
            right  = x + halfBar,
            bottom = 0,
            top    = y;

        ctx.save();
        ctx.fillStyle = options.color(element, i);
        ctx.beginPath();
          ctx.moveTo( tX( left ),  tY( bottom) );
          ctx.lineTo( tX( left ),  tY( top) );
          ctx.lineTo( tX( right ), tY( top) );
          ctx.lineTo( tX( right ), tY( bottom) );
        ctx.fill();
        ctx.restore();

        addLabel = function(klass, text, pos) {
          html = '<div style="position:absolute;" class="label ' + klass + '">' + text + "</div>";
          $(html).css(pos).appendTo( target );        
        }

        addLabel('bar-label', options.barLabel(element, i), {
          left: tX(x - 0.5),
          bottom: plot.height - tY(top),
          width: tX(1)
        });
        addLabel('axis-label', options.axisLabel(element, i), {
          left: tX(x - 0.5),
          top: tY(bottom),
          width: tX(1)
        });
      }
    }

    function tX( x ) { return               ( x - axis.x.min ) * (plot.width  / (axis.x.max - axis.x.min)); }
    function tY( y ) { return plot.height - ( y - axis.y.min ) * (plot.height / (axis.y.max - axis.y.min)); }

    function makePlot() {
      var plot = {};
      plot.width = target.width();
      plot.height = target.height();
      target.html( '' ).css( 'position', 'relative' );

      if( plot.width <= 0 || plot.height <= 0 ) {
          throw "Invalid dimensions for plot, width = " + plot.width + ", height = " + plot.height;
      }

      // the canvas
      canvas = $('<canvas width="' + plot.width + '" height="' + plot.height + '"></canvas>').appendTo( target ).get( 0 );
      if( $.browser.msie ) { canvas = window.G_vmlCanvasManager.initElement( canvas ); }
      plot.ctx = canvas.getContext( '2d' );
      return plot;
    }

    function makeAxis(options) {
      var axis = {
        x: {},
        y: {}
      }

      axis.x.min = 0
      axis.x.max = options.data.length;
      axis.y.min = 0;
      axis.y.max = 0;

      for (var i = 0; i < options.data.length; ++i) {
        element = options.data[i];
        var y = element[0]; // TODO: Support non-array y values
        if( y < axis.y.min )      throw("Negative values not supported");
        if( y > axis.y.max )      axis.y.max = y;
      }
      
      if( axis.x.max <= 0) throw("You must have at least one data point");
      if( axis.y.max <= 0) throw("You must have at least one y-value greater than 0");

      return axis;
    }
  }

} )( jQuery );
